const mongoose=require('mongoose')

const mongoURL='mongodb://localhost:27017/joblog';
mongoose.connect(mongoURL);
const db=mongoose.connection;

db.on('connected',()=>{
    console.log("connected to mongodb server");
})

db.on('error',(err)=>{
    console.log("mongodb error:",err);
})

db.on('disconnected',()=>{
    console.log("mongodb disconnected");
})

module.exports=db;  