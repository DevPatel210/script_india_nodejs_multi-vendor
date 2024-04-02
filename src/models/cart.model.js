const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  cartItems: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      quantity: {
        type: Number,
        default: 1,
      },
      bean: {
        type: String, // Assuming bean type is a string
        required: true,
      },
    },
  ],
});

exports.Cart = mongoose.model("Cart", cartSchema);
exports.cartSchema = cartSchema;
