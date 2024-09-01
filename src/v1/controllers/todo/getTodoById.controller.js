const { isValidObjectId } = require('mongoose');
const { asyncHandler } = require('../../../utils/asyncHandler.js');
const { ApiResponse } = require('../../../utils/ApiResponse.js');
const { Todo } = require('../../models/todo.models.js');
const CustomError = require('../../../utils/Error.js');
const redisClient = require('../../../utils/redisClient.js');

const getTodoById = asyncHandler(async (req, res, next) => {
  const { todoId } = req.params;

  if (!isValidObjectId(todoId)) {
    const error = CustomError.badRequest({
      message: 'Invalid Todo ID',
      errors: ['The provided Todo ID is not valid.'],
      hints: 'Please ensure that the Todo ID is correct and try again.',
    });

    return next(error);
  }

  // find is there any cache on redis
  const cachedValue = await redisClient.get(`todos:${todoId}`);

  if (cachedValue) {
    console.log('ache mal - single');

    const todo = JSON.parse(cachedValue);

    // return response
    return res.status(200).json(
      new ApiResponse(
        200,
        {
          ...todo,
          links: {
            self: `/todos/${todo._id}`,
            update: `/todos/${todo._id}`,
            delete: `/todos/${todo._id}`,
          },
        },
        'Todo Info fetched Successfully'
      )
    );
  }

  const todo = await Todo.findById(todoId);

  if (!todo) {
    const error = CustomError.notFound({
      message: 'Todo not found',
      errors: ['The todo with the provided id does not exist'],
      hints: 'Please provide a valid todo id',
    });

    return next(error);
  }

  // create new cache
  await redisClient.set(`todos:${todoId}`, JSON.stringify(todo), 'EX', 30);

  // return response
  return res.status(200).json(
    new ApiResponse(
      200,
      {
        ...todo._doc,
        links: {
          self: `/todos/${todo._id}`,
          update: `/todos/${todo._id}`,
          delete: `/todos/${todo._id}`,
        },
      },
      'Todo Info fetched Successfully'
    )
  );
});

module.exports = getTodoById;
