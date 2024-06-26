const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
var orderSchema = new mongoose.Schema(
  {
    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },
        count: Number,
        color: String,
      },
    ],
    paymentIntent: {
      id:String,
      paymentMethod:String,
      amount:Number,
      created:Date,
    },
    paymentStatus:Boolean,
    orderStatus: {
      type: String,
      default: "Not Processed",
      enum: [
        "Not Processed",
        "Payment Done",
        "Cash on Delivery",
        "Processing",
        "Dispatched",
        "Cancelled",
        "Delivered",
      ],
    },
    orderby: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

//Export the model
module.exports.Order = mongoose.model("Order", orderSchema);