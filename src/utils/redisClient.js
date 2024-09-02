const { Redis } = require('ioredis');

// Create a Redis instance.
const redisClient = new Redis(process.env.REDIS_URI);

// Test the connection
redisClient.on('connect', () => {
  console.log('🚀 ~ redisClient.on ~ connect:', 'Connected Successfully!');
});

redisClient.on('error', (err) => {
  console.log('🚀 ~ redisClient.on ~ err:', err);
});

// export the redis client
module.exports = redisClient;
