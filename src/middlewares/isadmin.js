const {User}= require("../models/userModel");
const mongoose=require("mongoose");

const isAdmin =async(req,res,next)=>{
    try {
        const id =req.userId;
    const user = await User.findOne({_id:id});
    if(user.role==="admin"){
        next();
    }
    else{
        res.json({msg:"you are not admin"});
    }
    } catch (error) {
        console.log(error);
    }
}
module.exports={isAdmin};