require('dotenv').config()      
const express = require("express");
const app = express();

//connecting databse
require("./db/connection")      

app.use(express.json());

//handling cookies
const cookieParser = require('cookie-parser')
app.use(cookieParser());



// connecting routes
const user_router = require("./routes/userRoutes");
app.use(user_router);
app.listen(process.env.PORT,()=>{console.log("server is ready")});