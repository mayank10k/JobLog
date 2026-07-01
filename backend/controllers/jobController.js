const Job=require('./../models/Job')
const redisClient=require('./../config/redis')

const addJob=async (req,res)=>{
    try{
        const {company,role,status,notes,reminderDate}=req.body

        const job=await Job.create({
            userId:req.user.id,
            company,
            role,
            status:status||"Applied",
            notes,
            reminderDate

        });

        // set a TTL reminder key — 7 days = 604800 seconds
        await redisClient.set(`reminder:${job._id}`, "pending", "EX", 604800);
        await redisClient.del(`stats:${req.user.id}`); // ← add this line

        res.status(201).json(job);

    }catch(err){
        res.status(500).json({message:err.message})
    }
};

const getAllJobs=async (req,res)=>{
    try{
        const {status}=req.query; //filter by status iff provided

        const filter={userId:req.user.id};
        if(status) filter.status=status;

        const jobs=await Job.find(filter).sort({createdAt:-1});
        res.status(200).json(jobs);
    }catch(err){
        res.status(500).json({message:err.message});

    }

}


const updateJob=async (req,res)=>{
    try{
        const job=await Job.findOne({_id:req.params.id,userId:req.user.id})

        if(!job){
            return res.status(404).json({message:"Job not found"})
        }

        const updated=await Job.findByIdAndUpdate(
            req.params.id,
            {$set:req.body}, //"Update only the fields present in req.body."
            {new:true}
        )
        await redisClient.del(`stats:${req.user.id}`);
        res.status(200).json(updated);
    }catch(err){
        res.status(500).json({message:err.message});

    }
}

const deleteJob=async (req,res)=>{
    try{
        const job=await Job.findOne({_id:req.params.id,userId:req.user.id})
        if (!job) {
            return res.status(404).json({ message: "Job not found" });
        }

        await Job.findByIdAndDelete(req.params.id);
        await redisClient.del(`stats:${req.user.id}`);
        res.status(200).json({message:"Job deleted Successfully"})

    }catch(err){
        res.status(500).json({error:err.message});
    }
}

const getStats=async (req,res)=>{
    try{
        //included for mongoose.Types.ObjectId(req.user.id) 
        const mongoose = require("mongoose");

        const cacheKey = `stats:${req.user.id}`;
        // check Redis cache first
        const cached = await redisClient.get(cacheKey);
        if (cached) {
            return res.status(200).json(JSON.parse(cached));
        }
        
        const stats=await Job.aggregate([
            // { $match: { userId: req.user.id } },
            { $match: { userId: new mongoose.Types.ObjectId(req.user.id) } }, // This converts the string into an ObjectId:
            { $group: { _id: "$status", count: { $sum: 1 } } },
        ])

        const formatted = {
            Applied: 0,
            Interview: 0,
            Offer: 0,
            Rejected: 0,
            total: 0,
        };

        stats.forEach((s) => {
            formatted[s._id] = s.count;
            formatted.total += s.count;
        });

        // cache for 10 minutes (600 seconds)
        await redisClient.set(cacheKey, JSON.stringify(formatted), "EX", 600);

        res.status(200).json(formatted);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
    
}

const getReminders=async(req,res)=>{
    try{
        const today=new Date();

        const jobs=await Job.find({
            userId:req.user.id,
            reminderDate:{$lte:today},
            status:{$nin:["Offer","Rejected"]} // no reminders for closed jobs
        })
        res.status(200).json(jobs);
    }catch(err){
        res.status(500).json({error:err.message});
    }
}

module.exports = {
  addJob,
  getAllJobs,
  updateJob,
  deleteJob,
  getStats,
  getReminders,
};