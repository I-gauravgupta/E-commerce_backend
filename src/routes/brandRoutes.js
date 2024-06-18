const express = require("express");
const router = express.Router();

const {  
    createBrand,
    updateBrand,
    deleteBrand,
    getBrand,
    getallBrand,
 
} = require("../controllers/brandCtrl");

//middlewares
const {jwtAuthMiddleware}=require("../middlewares/jwt_auth");
const {isAdmin}= require("../middlewares/isadmin");


router.post("/create", jwtAuthMiddleware, isAdmin, createBrand);
router.put("/update", jwtAuthMiddleware, isAdmin, updateBrand);
router.delete("/delete", jwtAuthMiddleware, isAdmin, deleteBrand);
router.get("/get", getBrand);
router.get("/getall", getallBrand);

module.exports = router;