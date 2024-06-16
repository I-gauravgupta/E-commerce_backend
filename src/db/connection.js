const mongoose = require("mongoose");

const main = async()=>{
    await mongoose.connect(process.env.DB);
}
main().then(()=>{console.log("database is connected")}).catch(err=>{console.log(err)});