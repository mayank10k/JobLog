const Redis = require("ioredis");

const redisClient = new Redis(process.env.REDIS_URL || "redis://localhost:6379", {
  lazyConnect: true,        // don't connect immediately
  retryStrategy: (times) => {
    if (times > 3) {
      console.log("Redis connection failed — running without Redis");
      return null;           // stop retrying after 3 attempts
    }
    return Math.min(times * 200, 1000);
  },
  maxRetriesPerRequest: 1,
});

redisClient.on("connect", () => {
  console.log("Redis connected successfully");
});

redisClient.on("error", (err) => {
  console.log("Redis unavailable:", err.message);
});

module.exports = redisClient;