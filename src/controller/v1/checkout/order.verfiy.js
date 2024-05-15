const { response } = require("../../../helpers/common");
const { verifyPayment } = require("../../../services/payment");
const { default: mongoose } = require("mongoose");
const { Order } = require("../../../models/order.model");
const { User } = require("../../../models/user.model");
const { Vendor } = require("../../../models/vendor.model");
const { sendEmail } = require("../../../services/email");

const makeMongoDbServiceOrder = require("../../../services/mongoDbService")({
  model: Order,
});
const makeMongoDbServiceUser = require("../../../services/mongoDbService")({
  model: User,
});
const makeMongoDbServiceVendor = require("../../../services/mongoDbService")({
  model: Vendor,
});

// exports.verifyOrder = async (req) => {
// 	try {
// 		let order;
// 		let paymentId = req.body.paymentId;
// 		let order_id = req.body.order_id;
// 		let paymentIntent = await verifyPayment(paymentId);
// 		if (paymentIntent.status === "succeeded") {
// 			order = await makeMongoDbServiceOrder.findOneAndUpdateDocument(
// 				{ _id: order_id },
// 				{ payment_status : "C", paymentIntent }
// 			);
// 			const user = await makeMongoDbServiceUser.getDocumentById(order.user_id);
// 			const message = getPaymentSuccessfulMessage(order);
// 			await sendEmail(user.email,'Payment Successful', message);
// 			return response(false, "Payment received successfully.", null, order,200);
// 		} else {
// 			order = await makeMongoDbServiceOrder.findOneAndUpdateDocument(
// 				{ _id: order_id },
// 				{ payment_status: "P" },
// 				{ payment_status: "PF" }
// 			);
// 			return response(true, "Order payment is incomplete.", null, order,400);
// 		}
// 	} catch (error) {
// 		throw response(true, null, error.message, error.stack,500);
// 	}
// };

exports.verifyOrder = async (req) => {
  let order_id = req.body.order_id;
  let paymentId = req.body.paymentId;
  try {
    let order;

    // Check if order_id is provided and is a valid ObjectId
    if (!order_id || !mongoose.Types.ObjectId.isValid(order_id)) {
      throw {
        status: "BAD_REQUEST",
        message: "The request cannot be fulfilled due to bad syntax",
        data: {
          order_id: "Enter valid order id",
        },
      };
    }

    let paymentIntent = await verifyPayment(paymentId);
    if (paymentIntent.status === "succeeded") {
      order = await makeMongoDbServiceOrder.findOneAndUpdateDocument(
        { _id: order_id },
        { payment_status: "C", status: "P", paymentId }
      );
      const user = await makeMongoDbServiceUser.getDocumentById(order.user_id);
      const message = getPaymentSuccessfulMessage(order);
      await sendEmail(user.email, "Payment Successful", message);
      for(let vendorId of order.vendors){
        const vendor = await makeMongoDbServiceVendor.getDocumentById(vendorId);
        const vendorMessage = getPaymentSuccessfulMessageVendor(order);
        await sendEmail(vendor.email, "Payment Successful", vendorMessage);
      }
      return response(
        false,
        "Payment received successfully.",
        null,
        order,
        200
      );
    } else {
      order = await makeMongoDbServiceOrder.findOneAndUpdateDocument(
        { _id: order_id },
        { payment_status: "PF", status: "PF", paymentId } // Update status to "PF" (Payment Failed)
      );
      return response(true, "Order payment failed.", null, order, 400);
    }
  } catch (error) {
    // If an error occurs, update the order status to "PF" and throw an error
    const order = await makeMongoDbServiceOrder.findOneAndUpdateDocument(
      { _id: order_id },
      { payment_status: "PF", status: "PF", paymentId } // Update status to "PF" (Payment Failed)
    );
    console.error(error.message);
    throw response(true, null, error.message, error.stack, 500);
  }
};

function getPaymentSuccessfulMessage(order) {
  return `
		Dear customer,<br>
		Your payment is completed successfully. Please find the details of your order below: 
		<h4>Order id:</h4> ${order._id.toString()}
		<h4>Shipping Address:</h4> ${order.shippingAddress}
		<h4>Billing Address:</h4> ${order.billingAddress}
		<h4>Final Price:</h4> $ ${order.accounting.finalTotal}
	`;
}

function getPaymentSuccessfulMessageVendor(order) {
  return `
		Dear Vendor,<br>
		Payment is completed successfully for an order. Please find the details of your order below: 
		<h4>Order id:</h4> ${order._id.toString()}
		<h4>Shipping Address:</h4> ${order.shippingAddress}
		<h4>Billing Address:</h4> ${order.billingAddress}
		<h4>Final Price:</h4> $ ${order.accounting.finalTotal}
	`;
}
