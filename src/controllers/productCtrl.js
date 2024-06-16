const {product}=require("../models/productModel");
const slugify = require("slugify");
const isValidId= require("../utils/idValidation");
const mongoose=require("mongoose")

//creatimg product 
const createProduct =async(req,res)=>{
    try {
        if(req.body.title)  req.body.slug=slugify(req.body.title);
        const Product = await new product(req.body);
        const newProduct = await Product.save();
        res.json(newProduct);
    } catch (error) {
        console.log(error);
        res.json({msg:"creation failed"});
    }
}

//get a product
const getAProduct = async(req,res)=>{
    try {
        const id = req.query.productid;
        const Product = await product.findById(id);
        res.json(Product);
    } catch (error) {
        console.log(error);
        res.json({msg:"Invalid id"});
    }
}

//get all product
const getAllProduct = async(req,res)=>{
    try{
        const products = await product.find();
    res.json(products);
    }
    catch(error){
        res.json({msg:"failed"});
    }
}

//update product
const updateProduct = async(req,res)=>{
    const id = req.query.productid;
    if(isValidId(id)){
        try {
            if(req.body.title)  req.body.slug=slugify(req.body.title);
            console.log(id);
            const find =await product.findOne({_id:id});
            console.log(find)
            const Product = await product.findOneAndUpdate({_id:id},req.body,{new:true});
            console.log(Product)
            res.json(Product)
        } catch (error) {
            console.log(error);
            res.json({msg:"updation failed"});
        }
    }
}

//delete product
const deleteProduct = async(req,res)=>{
    const id = req.query.id;
    try {
        const Product = await product.findByIdAndDelete(id)
        res.json(Product)
    } catch (error) {
        console.log(error);
        res.json({msg:"updation failed"});
    }
}

//get product after filtering
const getfilteredProduct = async(req,res)=>{
    try{
        const products = await product.find(req.query);
    res.json(products);
    }
    catch(error){
        res.json({msg:"failed"});
    }

}
module.exports={createProduct,getAProduct,getAllProduct,updateProduct,deleteProduct,getfilteredProduct};