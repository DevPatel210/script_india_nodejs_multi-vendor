const { response } = require("../../../helpers/common");
const { verifyPayment } = require("../../../services/payment");

const { Order } = require("../../../models/order.model");

const makeMongoDbServiceOrder = require("../../../services/mongoDbService")({
	model: Order,
});


exports.verifyOrder = async (req) => {
	try {
		let order;
		let paymentId = req.body.paymentId;
		let paymentIntent = await verifyPayment(paymentId);
		if (paymentIntent.status === "succeeded") {
			order = await makeMongoDbServiceOrder.findOneAndUpdateDocument(
				{ paymentId },
				{ payment_status : "C"}
			);
			return response(false, "Payment received successfully.", null, order);
		} else {
			order = await makeMongoDbServiceOrder.findOneAndUpdateDocument(
				{ paymentId },
				{ payment_status: "P" }
			);
			return response(false, "Order payment is incomplete.", null, order);
		}
	} catch (error) {
		throw response(true, null, error.message, error.stack);
	}
};
