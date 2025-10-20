const { Worker, Queue } = require("bullmq");
const axios = require('axios');
const Redis = require("ioredis");
var dotenv = require('dotenv');
dotenv.config();

const redisConnection = new Redis({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    maxRetriesPerRequest: null,
    enableOfflineQueue: true
});

const queue = new Queue("REDIS_DEV", { connection: redisConnection });

const worker = new Worker(
  "REDIS_DEV",
  async (job) => {
      try {
            console.log(`🚀 Processing job ${job.id}`);
            await new Promise((resolve) => setTimeout(resolve, 1000));

            //  insert to db
            
        } catch (err) {
            console.error("❌ Job failed:", err);
            throw err;
        }
    },
    {
        connection: redisConnection,
        concurrency: 5
    }
);

worker.on("completed", async(job) => {
  await queue.clean(0, "completed")
  console.log(`✅ Job ${job.id} completed successfully`);
});

worker.on("failed", (job, err) => {
  console.error(`❌ Job ${job.id} failed: ${err.message}`);
});