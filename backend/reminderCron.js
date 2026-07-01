const cron = require("node-cron");
const Job = require("./models/Job");
const redisClient = require("./config/redis");


const startReminderCorn=()=>{
  // runs every day at 9 AM
  // cron.schedule("* * * * *", async () => {
  cron.schedule("0 9 * * *", async () => {
    console.log("Running daily reminder check...");

    try{
      const jobs = await Job.find({
            status: { $nin: ["Offer", "Rejected"] },
            followUpDue: false,
          });

          for (const job of jobs) {
            const exists = await redisClient.exists(`reminder:${job._id}`);

            // if the Redis key has expired (no longer exists), flag the job
            if (!exists) {
              job.followUpDue = true;
              await job.save();
              console.log(`Flagged job ${job._id} as follow-up due`);
            }
          }
      }catch(err){
        console.error("cron error",err);
      }
    });

    console.log("Reminder cron started");
    

}

module.exports=startReminderCorn;
