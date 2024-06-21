const {Coupan}= require("../models/couponModel");
const isValidId= require("../utils/idValidation");

//creating coupan
const createCoupan=async(req,res)=>{
    try {
        const coupan = await Coupan.create(req.body);
        res.json({msg:"coupan created",coupan })
    } catch (error) {
        console.log(error);
    }
}

//get all coupan
const getallCoupan=async(req,res)=>{
    try {
        const coupans = await Coupan.find();
        res.json(coupans)
    } catch (error) {
        console.log(error);
    }
}

//update coupan
const updateCoupan=async(req,res)=>{
    try {
        const id = req.query.id;
        const updatedCoupan = await Coupan.findByIdAndUpdate(id,req.body,{new:true});
        res.json(updatedCoupan)
    } catch (error) {
        console.log(error);
    }
}

//delete coupan
const deleteCoupan=async(req,res)=>{
    try {
        const id = req.query.id;
        const coupan = await Coupan.findByIdAndDelete(id);
        res.json(coupan)
    } catch (error) {
        console.log(error);
    }
}
module.exports={createCoupan,updateCoupan,getallCoupan,deleteCoupan}