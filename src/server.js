require('dotenv').config()      
const express = require("express");
const app = express();

//connecting databse
require("./db/connection")      

app.use(express.json());


// connecting routes
const user_router = require("./routes/userRoutes");
const product_router =require("./routes/productRoutes");
const blog_router = require("./routes/blogRoutes");
const prod_category_router = require("./routes/prodCategoryRoutes");
const blog_category_router = require("./routes/blogCategoryRoutes");
const brand_router = require("./routes/brandRoutes");
app.use("/brand",brand_router);
app.use("/blogCategory",blog_category_router);
app.use("/prodCategory",prod_category_router);
app.use("/blog",blog_router)
app.use("/product",product_router);
app.use(user_router);



app.listen(process.env.PORT,()=>{console.log("server is ready")});