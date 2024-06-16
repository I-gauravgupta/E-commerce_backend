const mongoose = require("mongoose");

// Declare the Schema of the Mongo model
var userSchema = new mongoose.Schema({
    firstName:{
        type:String,
        required:true,
    },
    lastName:{
        type:String,
        required:true,
    },
    emailId:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    },
    role: {
        type: String,
        default: "user", 
    },
    isBlocked:{
        type:Boolean,
        default:"false"
    },
    cart: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CartItem',
    }],
    address: {
        type: String,
    },
    wishlist: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'WishlistItem',
    }],
}, {
    timestamps: true, 
});

//Export the model
module.exports.User = mongoose.model('User', userSchema);