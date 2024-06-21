const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var coupanSchema = new mongoose.Schema({
    coupanName:{
        type:String,
        required:true,
        unique:true,
        uppercase:true,
    },
    expiryDate:{
        type:Date,
        required:true,
    },
    discount:{
        type:Number,
        required:true,
    }
});

//Export the model
module.exports.Coupan = mongoose.model('Coupan', coupanSchema);