const mongoose =require("mongoose");

const isValidId = async(id)=>{
    if (! await mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ msg: "Invalid product ID" });
    }
    else true
}

module.exports=isValidId;