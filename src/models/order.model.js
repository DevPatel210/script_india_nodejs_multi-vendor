const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
	{
		user_id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		cart_id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Cart",
			required: true,
		},
		vendors: [{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Vendor",
			required: true,
		}],
		vendorNames: [{
			type: String,
			required: true,
		}],
		accounting: {
			type: Object,
			required: true,
		},
		status: {
			type: String,
			default: "P", // A,C,P,D,R(Received), PF(payment failed)
			minlength: 1,
			maxlength: 1,
		},
		paymentId: {
			type: String,
			required: false
		},
		shippingAddress: {
			type: String,
			required: true
		},
		billingAddress: {
			type: String,
			required: true
		},
		trackingDetails: {
			type: Object
		},
		payment_status: {
			type: String,
			default: "P", // I, C, P, PF
			minlength: 1,
			maxlength: 1,
		},
	},
	{
		timestamps: true,
	}
);

exports.Order = mongoose.model('Order', orderSchema);
exports.orderSchema = orderSchema;