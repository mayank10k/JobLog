const mongoose=require('mongoose');

const jobSchema=new mongoose.Schema({
    company:{
        type:String,
        required:true,
    },
    role:{
        type:String,

    },
    status:{
        type:String,

    },
    notes:{
        type:String
    },
    reminderDate:{
        type:Date,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
},
{
    timestamps: true
})

const Job=mongoose.model('Job',jobSchema);
module.exports=Job;