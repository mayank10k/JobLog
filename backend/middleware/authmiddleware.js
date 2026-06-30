const jwt=require('jsonwebtoken');
const redisClient=require('./../config/redis')

const jwtAuthMiddleware=async (req,res,next)=>{

    const authorization=req.headers.authorization;
    // if(!authorization)return res.status(401).json({error:'token not found'});
    if (!authorization || !authorization.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Authorization header missing or invalid" });
    }


    const token=authorization.split(' ')[1];
    if(!token)return res.status(401).json({error:'Unauthorized'})

    try{
        const decoded=jwt.verify(token,process.env.JWT_SECRET)
        
        //check if sessioin exist in redis
        const storedToken=await redisClient.get(`session:${decoded.id}`);
        if (!storedToken || storedToken !== token) {
            return res.status(401).json({ message: "Session expired or invalid, please login again" });
        }

        req.user=decoded;
        next();
    }catch(err){
        console.error(err);
        res.status(401).json({error:'Invalid token'})
    }
    
}

const generateToken=(userData)=>{
    return jwt.sign(userData,process.env.JWT_SECRET,{ expiresIn: "7d" });
}

module.exports={jwtAuthMiddleware,generateToken};