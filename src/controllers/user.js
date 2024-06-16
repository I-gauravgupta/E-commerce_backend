const {User}= require("../models/userModel");
const mongoose=require("mongoose")
const {hashPassword,validatePassword}= require("../utils/password")
const {getToken}=require("../utils/jwtToken");
const {forgetPasswordToken}=require("../utils/forgetPassToken")
const sendMail=require("../utils/mail")

// creating user
const createUser = async (req,res)=>{
    const email = req.body.emailId;
    const findUser = await User.findOne({emailId:email});
    if(findUser){
            res.json({
                msg:"user already exists",
                status:"false",
            })
    }
    else{
        try {
            const hpassword = await hashPassword(req.body.password);
            req.body.password=hpassword;
            const newUser = await new User(req.body);
            const createdUser = await newUser.save();
            const payload={
                id:createdUser._id,
                Username:createdUser.firstName +" " +createdUser.lastName,
            }
            const jwt_token = await getToken(payload);
            res.json({user:createdUser,token:jwt_token});
        } catch (error) {
            console.log(error);
        }
    }
}

// singinup user
const loginUser =async (req,res)=>{
    const user=req.user
    const payload={
        id:user._id,
        Username:user.firstName +" " +user.lastName,
    }
    const jwt_token = await getToken(payload);
    res.json({user:user,token:jwt_token});
}

//get all users
const alluser=async(req,res)=>{
    try {
        const getusers= await User.find();
        res.json(getusers);
    } catch (error) {
        res.json(error);
    }
}

//get single user
const getUser = async(req,res)=>{
    try {
        const id =await req.userPayload.payload.id;
        const user = await User.findOne({_id:id});
        if(user){   
            res.json(user);
        }
        else{
            res.json({msg:"user not found",status:"false"});
        }
    } catch (error) {
        res.json(error);
    }
}
//delete user
const dltUser = async(req,res)=>{
    try {
        const{id}=req.params;
        const user = await User.findOne({_id:id});
        if(user){   
            await User.deleteOne({_id:id});
            res.json({msg:"user deleted"});
        }
        else{
            res.json({msg:"user not found",status:"false"});
        }
    } catch (error) {
        res.json(error);
    }
}
//update user
const updateUser = async(req,res)=>{
    try {
        const id= req.userPayload.payload.id;
        const updatedUser = await User.findByIdAndUpdate({_id:id},{
            firstName:req.body.firstName,
            lastName:req.body.lastName,
            emailId:req.body.emailId,
        },{new:true});
        res.json(updatedUser);
    } catch (error) {
        res.json(error);
    }
}
const blockUser = async(req,res)=>{
    const id =req.userId;
    const user = User.findOneAndUpdate({_id:id},{isBlocked:"true"},{new:true});
    // console.log(user);
    res.json({msg:"userblocked"});
}
const unblockUser = async(req,res)=>{
    const id =req.userId;
    const user = User.findOneAndUpdate({_id:id},{isBlocked:"false"},{new:true});
    // console.log(user);
    res.json({msg:"user un-blocked"});
}

//FORGET PASSWORD MAIL
const sendForgetPasswordMail = async(req,res)=>{
    try {
    const emailid= await req.query.emailId;
    const user = await User.findOne({emailId:emailid});
    const token = await forgetPasswordToken(user.id);
    data={
       email:"gaurav.gupta7753@gmail.com",
       subject:"Forget your password",
       text: "hey user",
       html:`Follow this <a href="https://localhost:3000/changePassword/:${token}">link</a> to change your password.`
    }
    await sendMail(data);
    res.json({msg:"mail send. only vaild for 10 minutes"})
}
    catch (error) {
        console.log(error)
}
}

//change password
const changePassword=async(req,res)=>{
    const token = req.params.token;
    try {
        const decoded = await jwt.verify(token,process.env.SECRETKEY);
        const hpassword = await hashPassword(req.body.password);
        const user= User.findByIdAndUpdate(decoded.payload.id,{password:hpassword},{new:true});
        res.json(user);
    } catch (error) {
        console.log(error);
    }
}

module.exports= {createUser,loginUser,alluser,getUser,dltUser,updateUser,blockUser,unblockUser,sendForgetPasswordMail,changePassword};