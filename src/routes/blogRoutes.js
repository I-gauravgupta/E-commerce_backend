const express = require("express");
const router = express.Router();

const {createBlog, updateBlog,getBlog,getAllBlogs,deleteBlog, likeblog, dislikeblog}= require("../controllers/blogCtrl");

//middlewares
const {jwtAuthMiddleware}=require("../middlewares/jwt_auth");
const { JsonWebTokenError } = require("jsonwebtoken");



//routes
router.post("/createBlog",jwtAuthMiddleware,createBlog);
router.put("/updateBlog",jwtAuthMiddleware,updateBlog);
router.get("/getBlog",jwtAuthMiddleware,getBlog);
router.get("/allBlog",jwtAuthMiddleware,getAllBlogs);
router.delete("/deleteBlog",jwtAuthMiddleware,deleteBlog)
router.put("/like",jwtAuthMiddleware,likeblog);
router.put("/dislike",jwtAuthMiddleware,dislikeblog);

module.exports=router;