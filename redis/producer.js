const { jobQueue } = require("./queue");

async function addJobWebhook(payload) {
  await jobQueue.add("REDIS_DEV", payload, {removeOnComplete: true, removeOnFail: false});
  console.log("✅ Job added to queue");
}

module.exports = { addJobWebhook };