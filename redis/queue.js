const { Queue } = require("bullmq");
const Redis = require("ioredis");
var dotenv = require('dotenv');
dotenv.config();

const redisConnection = new Redis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  maxRetriesPerRequest: null,
  enableOfflineQueue: true
});

const jobQueue = new Queue("REDIS_DEV", {
  connection: redisConnection,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: "exponential",
      delay: 10000,
    },
  },
});

module.exports = {
  jobQueue
};