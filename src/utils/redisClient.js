const { Redis } = require('ioredis');

// Create a Redis instance.
// By default, it will connect to localhost:6379.
const redisClient = new Redis();

module.exports = redisClient;
