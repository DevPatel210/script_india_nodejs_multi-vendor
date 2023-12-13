const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema({
	product: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Product",
		required: true,
	},
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
	rating: {
		type: Number,
		required: true,
		min: 1,
		max: 5,
	},
	comment: {
		type: String,
		required: true,
	},
	date: {
		type: Date,
		default: Date.now,
	},
	status: {
		type: String,
		required: true,
		default: "A",
	},
});

const Review = mongoose.model("Review", ReviewSchema);

module.exports = Review;
