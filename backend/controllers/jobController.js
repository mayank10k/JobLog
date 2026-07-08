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

        await redisClient.set(`reminder:${job._id}`, "pending", "EX", 604800);
        await redisClient.del(`stats:${req.user.id}`);

        res.status(201).json(job);

    }catch(err){
        res.status(500).json({message:err.message})
    }
};

const getAllJobs=async (req,res)=>{
    try{
        const {status}=req.query;

        const filter={userId:req.user.id};
        if(status) filter.status=status;

        const jobs=await Job.find(filter).sort({createdAt:-1});
        res.status(200).json(jobs);
    }catch(err){
        res.status(500).json({message:err.message});
    }
};

const updateJob = async (req, res) => {
  try {
    const job = await Job.findOne({ _id: req.params.id, userId: req.user.id });

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // only Offer and Rejected are closed — NOT Interview
    const closedStatuses = ["Offer", "Rejected"];
    if (req.body.status && closedStatuses.includes(req.body.status)) {
      req.body.followUpDue = false;
      await redisClient.del(`reminder:${req.params.id}`);
    }

    // if status is moving back to Applied or Interview, keep followUpDue as is
    const updated = await Job.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    await redisClient.del(`stats:${req.user.id}`);
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteJob=async (req,res)=>{
    try{
        const job=await Job.findOne({_id:req.params.id,userId:req.user.id})
        if (!job) {
            return res.status(404).json({ message: "Job not found" });
        }

        await Job.findByIdAndDelete(req.params.id);
        // also clean up Redis keys for this job
        await redisClient.del(`reminder:${req.params.id}`);
        await redisClient.del(`stats:${req.user.id}`);
        res.status(200).json({message:"Job deleted Successfully"})

    }catch(err){
        res.status(500).json({error:err.message});
    }
};

const getStats=async (req,res)=>{
    try{
        const mongoose = require("mongoose");
        const cacheKey = `stats:${req.user.id}`;

        const cached = await redisClient.get(cacheKey);
        if (cached) {
            return res.status(200).json(JSON.parse(cached));
        }
        
        const stats=await Job.aggregate([
            { $match: { userId: new mongoose.Types.ObjectId(req.user.id) } },
            { $group: { _id: "$status", count: { $sum: 1 } } },
        ]);

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

        await redisClient.set(cacheKey, JSON.stringify(formatted), "EX", 600);
        res.status(200).json(formatted);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getReminders=async(req,res)=>{
    try{
        const today=new Date();

        // fixed: removed duplicate reminderDate outside $or
        const jobs=await Job.find({
            userId:req.user.id,
            status:{ $nin:["Offer","Rejected"] },
            $or: [
                { reminderDate: { $lte: today } },
                { followUpDue: true },
            ],
        });

        res.status(200).json(jobs);
    }catch(err){
        res.status(500).json({error:err.message});
    }
};

module.exports = {
  addJob,
  getAllJobs,
  updateJob,
  deleteJob,
  getStats,
  getReminders,
};