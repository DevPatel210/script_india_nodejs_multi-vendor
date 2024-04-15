const { array } = require("joi");
const mongoose = require("mongoose");

const extraAttrSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  value: {
    type: String,
    required: true,
  },
});

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    subTitle: {
      type: String,
    },
    author: {
      type: String,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    // offer_price: {
    // 	type: Number,
    // 	required: true,
    // },
    markup_price: {
      type: String,
      required: true,
    },
    total_price: {
      type: Number,
    },
    image: {
      type: Array,
      required: true,
    },
    // category: {
    // 	type: String,
    // 	required: false,
    // },
    status: {
      type: String,
      required: true,
      default: "P",
    },
    isSoldOut: {
      type: Boolean,
      required: true,
      default: false,
    },
    weight: {
      type: String,
      required: true,
    },
    origins: {
      type: String,
      required: true,
    },
    missions: {
      type: String,
      required: true,
    },
    roast: {
      type: String,
      required: true,
    },
    bean: {
      type: [String],
      required: true,
    },
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vendor",
      required: true,
    },
    oldDetails: {
      type: Object,
    },
    extraAttr: [extraAttrSchema],
  },
  { timestamps: true }
);

exports.Product = mongoose.model("Product", productSchema);
exports.productSchema = productSchema;
