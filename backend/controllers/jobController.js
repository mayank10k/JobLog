const Job=require('./../models/Job')

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
        res.status(200).json({message:"Job deleted Successfully"})

    }catch(err){
        res.status(500).json({error:err.message});
    }
}

const getStats=async (req,res)=>{
    try{
        const stats=await Job.aggregate([
            { $match: { userId: req.user.id } },
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