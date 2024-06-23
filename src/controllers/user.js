const {User}= require("../models/userModel");
const mongoose=require("mongoose")
const {hashPassword,validatePassword}= require("../utils/password")
const {getToken}=require("../utils/jwtToken");
const {forgetPasswordToken}=require("../utils/forgetPassToken")
const sendMail=require("../utils/mail")
const {Cart}=require("../models/cartModel");
const {product}=require("../models/productModel")
const{Coupan}=require("../models/couponModel");

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
    const id =req.query.id;
    const user = await User.findOneAndUpdate({_id:id},{isBlocked:"true"},{new:true});
    res.json({msg:"userblocked"});
}
const unblockUser = async(req,res)=>{
    const id =req.query.id;
    const user = await User.findOneAndUpdate({_id:id},{isBlocked:"false"},{new:true});
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

// add to wishlist
const addToWishlist = async(req,res)=>{
    const UserId = req.userPayload.payload.id;
    const prodId = req.query.id;
try {
    const user = await User.findById(UserId);
    const alreadyWishlist = user.wishlist.find((id)=>id.toString()===prodId);
    if(alreadyWishlist){
        const updateduser = await User.findByIdAndUpdate(UserId,
                {$pull:{wishlist :prodId}}
        ,{new:true});
    res.json({msg:"item removed from wishlist"});
    }
    else{
        const updateduser = await User.findByIdAndUpdate(UserId,
            {$push:{wishlist :prodId}}
                            ,{new:true});
            res.json({msg:"item added to wishlist"});
    }
} catch (error) {
    throw new Error(error);
}    
}

//add to cart
const addToCart = async(req,res)=>{
    const userId = req.userPayload.payload.id; 
    const prodId = req.query.id;
    try {
        let user = await User.findById(userId).exec(); 
        if (!user.cart) {
            const newCart = await Cart.create({ orderby: userId });
            user = await User.findByIdAndUpdate(userId, { cart: newCart.id }, { new: true });
        }
        const cart = await Cart.findById(user.cart);
        let productInCart = cart.products.find((product) => product.product.toString() === prodId);
        if (productInCart) {
            await Cart.findOneAndUpdate(
                { _id: cart._id, "products.product": prodId },
                { $inc: { "products.$.count": 1 } },
            );
        } else {
            const item = await product.findById(prodId);
            await Cart.findByIdAndUpdate(
                cart._id,
                {
                    $push: {
                        products: {
                            product: prodId,
                            count: 1,
                            color: item.color,
                            price: item.price,
                        }
                    }
                }
            );
        }
        const updatedCart = await Cart.findById(cart._id);
        let cartTotal = 0;
        updatedCart.products.forEach(product => {
            cartTotal += product.count * product.price;
        });
        let totalAfterDiscount = cartTotal;
        const finalCart = await Cart.findByIdAndUpdate(
            cart._id,
            { cartTotal, totalAfterDiscount },
            { new: true }
        );
        res.json({ user, finalCart });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// get cart
const getCart= async(req,res)=>{
    try {
    const userId = req.userPayload.payload.id; 
    let user = await User.findById(userId).exec();
    if(user.cart && user.cart !=null){
        const cart = await Cart.findById(user.cart);
        res.json(cart)
    } 
    else{
        console.log("Creating a new cart.");
            const newCart = await Cart.create({ orderBy: userId });
            user = await User.findByIdAndUpdate(userId, { cart: newCart._id }, { new: true }).exec();
            res.json(newCart);
    }
    } catch (error) {
        res.json(error);
    }
}

//empy cart
const emptyCart = async(req,res)=>{
    const userId = req.userPayload.payload.id;
    try {
        let user = await User.findById(userId).exec();
        if(user.cart){
            await Cart.findByIdAndDelete(user.cart);
            await User.findByIdAndUpdate(userId,{cart:null})

            res.json({msg:"cart is empty"})       // return null
        }
        } catch (error) {
            res.json(error);
        }

}

const applyCoupan = async(req,res)=>{
    const coupanName= req.query.coupan;
    const userId = req.userPayload.payload.id;
    try {
        const coupan = await Coupan.findOne({coupanName});
        if(!coupan) return res.json({msg:"inavlid Coupan"});
        const discount = coupan.discount;
        const user = await User.findById(userId);
        const cart = await Cart.findById(user.cart);
        if(cart.isCoupanApplied==1) return res.json("one coupan already Applied");
        const totalAfterDiscount = cart.cartTotal-discount;
        const finalTotal = Math.max(totalAfterDiscount, 0);
        const updatedCart = await Cart.findByIdAndUpdate(
            cart._id,
            {totalAfterDiscount: finalTotal ,isCoupanApplied:true},
            { new: true } 
        ).exec();
        res.json(updatedCart)
    } catch (error) {
        throw new Error(error)
    }
}

// remove coupan 
const removeCoupan = async(req,res)=>{
    const userId = req.userPayload.payload.id;
    try {
    const user = await User.findById(userId);
    const cart = await Cart.findById(user.cart);
    if(cart){
        const updatedCart = await Cart.findByIdAandUpdate(user.cart,{isCoupanApplied:false,totalAfterDiscount:cart.cartTotal},{new:true});
    }
    } catch (error) {
        throw new Error(error);
    }
}

// get wishlist
const getWishList= async(req,res)=>{
    try {
    const userId = req.userPayload.payload.id; 
    let user = await User.findById(userId).exec(); 
    res.json(user.wishlist)
    } catch (error) {
        res.json(error);
    }
}
// save address
const saveAddress = async(req,res)=>{
    const id =req.userPayload.payload.id;
    try {
        const user = await User.findByIdAndUpdate(id,{address:req.body.address},{new:true});
        res.json(user)
    } catch (error) {
        throw new Error(error);
    }

}



module.exports= {createUser,loginUser,
    alluser,getUser,dltUser,
    updateUser,blockUser,unblockUser,
    sendForgetPasswordMail,changePassword,addToCart,addToWishlist,
    getWishList,getCart,saveAddress,emptyCart,applyCoupan,removeCoupan};