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
app.use("/blog",blog_router)
app.use("/product",product_router);
app.use(user_router);



app.listen(process.env.PORT,()=>{console.log("server is ready")});