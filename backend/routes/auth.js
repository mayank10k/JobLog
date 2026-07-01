const express=require('express')
const router=express.Router();
const {signup,login,logout}=require('./../controllers/authController')
const { jwtAuthMiddleware } = require('../middleware/authmiddleware');

router.post('/signup',signup);
router.post('/login',login)
router.post('/logout',jwtAuthMiddleware,logout);


module.exports=router;