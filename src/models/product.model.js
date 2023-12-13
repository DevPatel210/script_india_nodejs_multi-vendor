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

const productSchema = new mongoose.Schema({
	title: {
		type: String,
		required: true,
	},
	subTitle: {
		type: String,
		required: true,
	},
	author: {
		type: String,
		required: true,
	},
	description: {
		type: String,
		required: true,
	},
	price: {
		type: Number,
		required: true,
	},
	offer_price: {
		type: Number,
		required: true,
	},
	image: {
		type: Array,
		required: true,
	},
	category: {
		type: String,
		required: false,
	},
	status: {
		type: String,
		required: true,
		default: "A",
	},
	isSoldOut: {
		type: Boolean,
		required: true,
		default: false,
	},
	extraAttr: [extraAttrSchema],
});

exports.Product = mongoose.model("Product", productSchema);
exports.productSchema = productSchema;