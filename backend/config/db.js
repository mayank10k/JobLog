const mongoose=require('mongoose')

const mongoURL=process.env.MONGODB_URL_LOCAL;
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