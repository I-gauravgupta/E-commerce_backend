const express =require("express");
const router= express.Router();
const {createUser,loginUser,alluser,dltUser,getUser,updateUser,blockUser,unblockUser}= require("../controllers/user")
const {jwtAuthMiddleware}=require("../middlewares/jwt_auth")
const {isAdmin}= require("../middlewares/isadmin");

//authentication
const passport =require("../middlewares/passport");
router.use(passport.initialize());
const LocalauthMiddleware=passport.authenticate('local',{session:false})

//routes
// router.get("/",LocalauthMiddleware,(req,res)=>{res.json(req.user);})
router.post("/register",createUser);
router.get("/login",LocalauthMiddleware,loginUser);
router.get("/alluser",jwtAuthMiddleware,isAdmin,alluser);
router.get("/getuser",jwtAuthMiddleware,getUser);
router.delete("/dltUser/:id",jwtAuthMiddleware,dltUser);
router.put("/updateUser/:id",jwtAuthMiddleware,updateUser);
router.put("/block-user",jwtAuthMiddleware,isAdmin,blockUser); 
router.put("/unblock-user",jwtAuthMiddleware,isAdmin,unblockUser);


module.exports=router;