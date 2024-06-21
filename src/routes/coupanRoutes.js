const express = require("express");
const router = express.Router();

// middlewares
const {jwtAuthMiddleware}=require("../middlewares/jwt_auth");
const {isAdmin}= require("../middlewares/isadmin");
const { createCoupan, getallCoupan, deleteCoupan, updateCoupan } = require("../controllers/coupanCtrl");

// routes
router.post("/create",jwtAuthMiddleware,isAdmin,createCoupan);
router.get("/get",jwtAuthMiddleware,isAdmin,getallCoupan)
router.put("/update",jwtAuthMiddleware,isAdmin,updateCoupan)
router.delete("/delete",jwtAuthMiddleware,isAdmin,deleteCoupan)


module.exports= router;