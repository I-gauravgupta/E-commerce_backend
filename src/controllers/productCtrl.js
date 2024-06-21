const {product}=require("../models/productModel");
const slugify = require("slugify");
const isValidId= require("../utils/idValidation");
// const mongoose=require("mongoose")
const {User}= require("../models/userModel")
const {uploadOnCloudinary}=require("../utils/cloudinary")
const {productImageResize} =require("../middlewares/uploadProductImage");
const { response } = require("express");
const path = require("path")

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
            const Product = await product.findOneAndUpdate({_id:id},req.body,{new:true});
            res.json(Product)
        } catch (error) {
            console.log(error);
            res.json({msg:"updation failed"});
        }
    }
}

//delete product
const deleteProduct = async(req,res)=>{
    const id = req.query.productid;
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

// add ratings
const addRatings = async(req,res)=>{
    const UserId = req.userPayload.payload.id;
    const prodId = req.body.id; 
    const stars = req.body.stars;
    const comment = req.body.comment;
    try {
        const Product = await product.findById(prodId);
        let alreadyRated = Product.ratings.find((ratings) =>ratings.postedBy?.toString() === UserId.toString());
        if(alreadyRated){
            const updatedProduct = await product.findOneAndUpdate(
                {
                    _id: prodId,
                    "ratings._id": alreadyRated._id 
                },
                {
                    $set: { "ratings.$.star": stars,"ratings.$.comment": comment } 
                },
                {
                    new: true 
                }
            );
        res.json({msg:"ratings added"})
        }
        else{
            const updatedProduct=await product.findByIdAndUpdate(prodId,{
                $push:{
                    ratings:{
                        star:stars,
                        comment:comment,
                        postedBy:UserId
                    }
                }
            },{new:true})
            const getallratings = await product.findById(prodId);
    let totalRating = getallratings.ratings.length;
    let ratingsum = getallratings.ratings
      .map((item) => item.star)
      .reduce((prev, curr) => prev + curr, 0);
    let actualRating = Math.round(ratingsum / totalRating);
    let finalproduct = await product.findByIdAndUpdate(
      prodId,
      {
        totalrating: actualRating,
      },
      { new: true }
    );
            res.json({msg:"ratings added",finalproduct})

 }
    } catch (error) {
        throw new Error(error);
    }
}

//upload image
const uploadImage=async(req,res)=>{
    const urls =[];
    try {
        const prodId= req.query.prodid;
        for(const file of req.files){
            const img= file.path;
            const {filename}=file;
            await productImageResize(img,filename)
            const response= await uploadOnCloudinary(path.join(__dirname, "../uploads/products",`resized_${filename}`));
            urls.push(response);
        }
        const Product = await product.findByIdAndUpdate(
            prodId,
            {
              $push: {
                images: { $each: urls }
              }
            },
            { new: true } 
          );
        res.json(Product);
    } catch (error) {
        throw new Error(error);
    }
}

module.exports={createProduct,getAProduct,
    getAllProduct,updateProduct,
    deleteProduct,getfilteredProduct,
    addRatings,uploadImage};