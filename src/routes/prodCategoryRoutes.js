const express = require("express");
const router = express.Router();

const {createCategory,updateCategory,deleteCategory,getCategory,getallCategory,} = require("../controllers/prodcategoryCtrl");

// middlewares
const {jwtAuthMiddleware}=require("../middlewares/jwt_auth");
const {isAdmin}= require("../middlewares/isadmin");


router.post("/create", jwtAuthMiddleware, isAdmin, createCategory);
router.put("/update", jwtAuthMiddleware, isAdmin, updateCategory);
router.delete("/delete", jwtAuthMiddleware, isAdmin, deleteCategory);
router.get("/getcategory", getCategory);
router.get("/getall", getallCategory);

module.exports = router;