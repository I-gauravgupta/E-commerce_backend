const express =require("express");
const router= express.Router();
const {createUser,loginUser,alluser,dltUser,getUser,updateUser,
    blockUser,unblockUser, sendForgetPasswordMail, changePassword, addToWishlist, 
    addToCart, saveAddress, getCart, emptyCart, applyCoupan, removeCoupan}= require("../controllers/user")

//middlewares
const {jwtAuthMiddleware}=require("../middlewares/jwt_auth");
const {isAdmin}= require("../middlewares/isadmin");

//authentication
const passport = require("../middlewares/passport");
router.use(passport.initialize());

const LocalauthMiddleware = passport.authenticate('local', { session: false });

//routes

router.post("/register",createUser);
router.post("/login",passport.authenticate('local',{session:false}), loginUser);
router.get("/alluser",jwtAuthMiddleware,isAdmin,alluser);
router.get("/getuser",jwtAuthMiddleware,getUser);
router.delete("/dltUser/:id",jwtAuthMiddleware,dltUser);
router.put("/updateUser",jwtAuthMiddleware,updateUser);
router.put("/block-user",jwtAuthMiddleware,isAdmin,blockUser); 
router.put("/unblock-user",jwtAuthMiddleware,isAdmin,unblockUser);
router.post("/forgetPasswordMAil",sendForgetPasswordMail);
router.post("/changePassword/:token",changePassword);
router.post("/addtowishlist",jwtAuthMiddleware,addToWishlist);
router.post("/addtoCart",jwtAuthMiddleware,addToCart);
router.post("/saveAddress",jwtAuthMiddleware,saveAddress);
router.get("/getcart",jwtAuthMiddleware,getCart);
router.delete("/emptycart",jwtAuthMiddleware,emptyCart);
router.post("/cart/applycoupan",jwtAuthMiddleware,applyCoupan)
router.post("/cart/removecoupan",jwtAuthMiddleware,removeCoupan);









module.exports=router;