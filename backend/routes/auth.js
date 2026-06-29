const express=require('express')
const router=express.Router();
const User=require('./../models/User');
const { generateToken } = require('../middleware/authmiddleware');

router.post('/signup',async(req,res)=>{
    try{
        const data=req.body;

        const newUser=new User(data);

        const response=await newUser.save();
        console.log("data saved");

        const payload={
            id:response.id
        }

        const token=generateToken(payload);

        res.status(200).json({response:response,token:token})

    }catch(err){
        console.log(err);
        res.status(500).json({error:'internal serverr error'})
    }
})

//login route
router.post('/login',async(req,res)=>{
  try{
    
    const {email,password}=req.body;

    //find the username from db
    const user=await User.findOne({email:email});

    if(!user || !(await user.comparePassword(password))){
      return res.status(401).json({error:"Invalid email or password"});
    }

    const payload={
      id:user.id,
    }
    const token=generateToken(payload);

    res.json({token});
    
  }catch(err){
    console.log(err);
    res.status(500).json({error:'internal server error'})
  }
})

module.exports=router;