const mongoose=require('mongoose');

const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    }
});

userSchema.pre('save',async function (){
    const user=this;
    
    if(!user.isModified('password'))return;

    try{
        const salt=await bcrypt.genSalt(10);

        const hashedPassword=await bcrypt.hash(user.password,salt);
        user.password=hashedPassword;

    }catch(err){
        return err;
    }
    
})

userSchema.methods.comparePassword=async function(userPassword){
    try{
        const isMatch=await bcrypt.compare(userPassword);
        return isMatch;

    }catch(err){
        throw err;
    }
}

const User=mongoose.model('User',userSchema);
module.exports=User;