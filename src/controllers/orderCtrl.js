const {User}=require("../models/userModel");
const {Cart}=require("../models/cartModel");
const{Order}=require("../models/orderModel");
var uniqid = require('uniqid'); 


// empty exixting Cart 
const emptyExistingCart = async(userId)=>{
    try {
        const user = await User.findById(userId).exec();
        if (user && user.cart) {
            await Cart.findByIdAndDelete(user.cart);
            await User.findByIdAndUpdate(userId, { cart: null });
            return true; 
        }
        return false;
    } catch (error) {
        console.error("Error emptying the cart:", error);
        throw new Error("Error emptying the cart");
    }
}

// order func
const createOrder = async(req,res)=>{
    const userId = req.userPayload.payload.id; 
    try {
        let user = await User.findById(userId);
        let cart = await Cart.findById(user.cart);
        const finalAmount=cart.totalAfterDiscount;
        //creating order
        const newOrder = await Order.create({
            products:cart.products,
            paymentIntent:{
                id:uniqid(),
                amount: finalAmount,
                created: Date.now(),
            },
            orderStatus:"Not Processed",
            orderby:userId
        })
        // if order is succesfully created > empty cart
        if(newOrder){
            user = await User.findByIdAndUpdate(userId,{$push:{orders:newOrder._id}},{new:true});     
            const cartStatus= await emptyExistingCart(userId)
            if(cartStatus){
                return res.json({user,newOrder});
            }
            else{
                await Order.findByIdAndDelete(newOrder._id);
                return res.json({msg:"unable to place order"})
            }
        }
    } catch (error) {
        throw new Error(error);
    }
}
const getAllOrders = async (req,res)=>{
    const userId = req.userPayload.payload.id; 
    try{
        let user = await User.findById(userId).populate("orders");
        const orders = User.orders;
        res.json(orders);
    }
    catch(error){
        throw new Error(error);
    }
}

//place order
const placeOrder =async(req,res)=>{
    const userId = req.userPayload.payload.id;
    const {id}=req.query;
    const paymentMethod=req.query.method;
    const paymentStatus=req.query.status;       //originaly res.payment.status
    try {
        let user = await User.findById(userId);
        let order = await Order.findById(id);
        //considering that payment is done on middleware
        try {
            if(paymentMethod==="Online" && paymentStatus==="true"){           
                order = await Order.findByIdAndUpdate(id, {
                    $set: {
                        "paymentIntent.paymentMethod": paymentMethod,
                        paymentStatus: true,
                        orderStatus:"Payment Done"
                    }
                }, { new: true }).exec();
                return res.json(order);
            }
        } catch (error) {
            throw new Error("payment is done but failed to place order");
        }
        try {
            if(paymentMethod==="COD"){
                order = await Order.findByIdAndUpdate(id, {
                    $set: {
                        "paymentIntent.paymentMethod": paymentMethod,
                        paymentStatus: false,
                        orderStatus:"Cash on Delivery",
                    }
                }, { new: true }).exec();
                return res.json(order);
            }
        } catch (error) {
            throw new Error("failed to place order")
        }
    } catch (error) {
        throw new Error(error);
    }
}

module.exports={createOrder,getAllOrders,placeOrder}