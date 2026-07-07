const redisClient = require('../config/redis');
const User=require('./../models/User');
const { generateToken } = require('../middleware/authmiddleware');

const signup=async(req,res)=>{
    try{
        const data=req.body;

        const newUser=new User(data);

        const response=await newUser.save();
        console.log("data saved");

        const payload={
            id:response.id
        }

        const token=generateToken(payload);
        await redisClient.set(`session:${response.id}`,token,"EX",604800)

        res.status(200).json({
            token,
            user: {
                id: response._id,
                name: response.name,
                email: response.email
            }
        });
        
    }catch(err){
        console.log(err);
        res.status(500).json({error:'internal serverr error'})
    }
}

const login=async(req,res)=>{
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

        await redisClient.set(`session:${user.id}`,token,"EX",604800)

        res.json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });

  }catch(err){
    console.log(err);
    res.status(500).json({error:'internal server error'})
  }
}

const logout = async (req, res) => {
  try {
    // delete session from Redis using user id
    await redisClient.del(`session:${req.user.id}`);

    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports={signup,login,logout};