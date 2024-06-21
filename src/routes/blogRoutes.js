const express = require("express");
const router = express.Router();

const {createBlog, updateBlog,getBlog,getAllBlogs,deleteBlog, likeblog, dislikeblog,uploadImage}= require("../controllers/blogCtrl");

//middlewares
const {jwtAuthMiddleware}=require("../middlewares/jwt_auth");
const { JsonWebTokenError } = require("jsonwebtoken");

// uploads
const{uploadBlogImage}=require("../middlewares/uploadBlogImage");
const { isAdmin } = require("../middlewares/isadmin");
const handlingImage=uploadBlogImage.array("images",10);


//routes
router.post("/createBlog",jwtAuthMiddleware,createBlog);
router.put("/updateBlog",jwtAuthMiddleware,updateBlog);
router.get("/getBlog",jwtAuthMiddleware,getBlog);
router.get("/allBlog",jwtAuthMiddleware,getAllBlogs);
router.delete("/deleteBlog",jwtAuthMiddleware,deleteBlog)
router.put("/like",jwtAuthMiddleware,likeblog);
router.put("/dislike",jwtAuthMiddleware,dislikeblog);
router.post("/upload",jwtAuthMiddleware,isAdmin,handlingImage,uploadImage);

module.exports=router;