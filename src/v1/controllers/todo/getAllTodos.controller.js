const { asyncHandler } = require('../../../utils/asyncHandler.js');
const { ApiResponse } = require('../../../utils/ApiResponse.js');
const { Todo } = require('../../models/todo.models.js');
const redisClient = require('../../../utils/redisClient.js');

const getAllTodos = asyncHandler(async (req, res, next) => {
  // check that is there any cache available for all todos
  const cachedValue = await redisClient.get('todos:all');

  if (cachedValue) {
    console.log('ache mal');

    const todos = JSON.parse(cachedValue);
    return res
      .status(200)
      .json(new ApiResponse(200, todos, 'All Todos  fetched Successfully'));
  }

  // find all todos in DB
  const todos = await Todo.find();

  // create new cache for all todos
  await redisClient.set('todos:all', JSON.stringify(todos), 'EX', 30);

  // return response
  return res
    .status(200)
    .json(new ApiResponse(200, todos, 'All Todos  fetched Successfully'));
});

module.exports = getAllTodos;
