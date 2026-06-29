const mongoose=require('mongoose');
const bcrypt=require('bcrypt');

const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique: true,      // No two users can have the same email
        lowercase: true,   // Converts "ABC@GMAIL.COM" → "abc@gmail.com"
        trim: true,         // Removes leading/trailing spaces
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
        const isMatch=await bcrypt.compare(userPassword,this.password);
        return isMatch;

    }catch(err){
        throw err;
    }
}

const User=mongoose.model('User',userSchema);
module.exports=User;