const { response } = require("../../../helpers/common");
const { verifyPayment } = require("../../../services/payment");

const { Order } = require("../../../models/order.model");
const { User } = require("../../../models/user.model");
const { sendEmail } = require("../../../services/email");

const makeMongoDbServiceOrder = require("../../../services/mongoDbService")({
	model: Order,
});
const makeMongoDbServiceUser = require("../../../services/mongoDbService")({
	model: User,
});


exports.verifyOrder = async (req) => {
	try {
		let order;
		let paymentId = req.body.paymentId;
		let order_id = req.body.order_id;
		let paymentIntent = await verifyPayment(paymentId);
		if (paymentIntent.status === "succeeded") {
			order = await makeMongoDbServiceOrder.findOneAndUpdateDocument(
				{ _id: order_id },
				{ payment_status : "C", paymentIntent }
			);
			const user = await makeMongoDbServiceUser.getDocumentById(order.user_id);
			const message = getPaymentSuccessfulMessage(order);
			await sendEmail(user.email,'Payment Successful', message);
			return response(false, "Payment received successfully.", null, order,200);
		} else {
			order = await makeMongoDbServiceOrder.findOneAndUpdateDocument(
				{ _id: order_id },
				{ payment_status: "P" }
			);
			return response(true, "Order payment is incomplete.", null, order,400);
		}
	} catch (error) {
		throw response(true, null, error.message, error.stack,500);
	}
};

function getPaymentSuccessfulMessage(order){
	return `
		Dear customer,<br>
		Your payment is completed successfully. Please find the details of your order below: 
		<h4>Order id:</h4> ${order._id.toString()}
		<h4>Shipping Address:</h4> ${order.shippingAddress}
		<h4>Billing Address:</h4> ${order.billingAddress}
		<h4>Final Price:</h4> $ ${order.accounting.finalTotal}
	`
}