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
    date:{
        type:String,
    }
})

const Job=mongoose.model('Job',userSchema);
module.exports=Job;