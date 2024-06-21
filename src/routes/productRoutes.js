const express =require("express");
const router = express.Router();
const{createProduct, getAProduct,getAllProduct, updateProduct, deleteProduct, getfilteredProduct, addToWishlist, addRatings,uploadImage}=require("../controllers/productCtrl");

//middlewares
const {isAdmin}=require("../middlewares/isadmin");
const {jwtAuthMiddleware}=require("../middlewares/jwt_auth");

//uploads
const{uploadProductImage}=require("../middlewares/uploadProductImage");
const handlingImage=uploadProductImage.array("images",10);

//routes
router.post("/createProduct",jwtAuthMiddleware,isAdmin,createProduct);
router.get("/getProduct",jwtAuthMiddleware,getAProduct);
router.get("/allproduct",jwtAuthMiddleware,isAdmin,getAllProduct);
router.put("/update",jwtAuthMiddleware,isAdmin,updateProduct);
router.delete("/delete",jwtAuthMiddleware,isAdmin,deleteProduct);
router.get("/filtered",jwtAuthMiddleware,getfilteredProduct);
router.post("/addtowishlist",jwtAuthMiddleware,addToWishlist);
router.post("/addRatings",jwtAuthMiddleware,addRatings);
router.post("/uploadimage",jwtAuthMiddleware,isAdmin,handlingImage,uploadImage);




module.exports=router;