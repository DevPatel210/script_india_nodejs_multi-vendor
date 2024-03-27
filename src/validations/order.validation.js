const { body, query } = require("express-validator");

module.exports = {
	getOrder: [
		query("order_id", "Enter valid order id").notEmpty().optional().isString().isMongoId(),
		query("pageNumber", "pageNumber parameter should be number").default(1).toInt(),
	],

	getOrderPaid: [
		query("order_id", "Enter valid order id").notEmpty().optional().isString().isMongoId(),
		query("pageNumber", "pageNumber parameter should be number").default(1).toInt(),
	],

	getOrderShipped: [
		query("order_id", "Enter valid order id").notEmpty().optional().isString().isMongoId(),
		query("pageNumber", "pageNumber parameter should be number").default(1).toInt(),
	],
	
	getOrderCancel: [
		query("order_id", "Enter valid order id").notEmpty().optional().isString().isMongoId(),
		query("pageNumber", "pageNumber parameter should be number").default(1).toInt(),
	],
	
	getOrderPaymentFailed: [
		query("pageNumber", "pageNumber parameter should be number").default(1).toInt(),
	],

	getOrdersByDate: [
		query("startDate", "Enter valid order id").notEmpty().isString(),
		query("endDate", "pageNumber parameter should be number").notEmpty().isString(),
	],

	updateOrder: [
		body("order_id", "Enter valid order id").notEmpty().isString().isMongoId(),
		body("status", "Enter valid status: A - Accepted, C- Cancelled, P - Pending, D - Deleted, S - Shipped, R - Received").notEmpty().isString().optional().isIn(['A','C', 'P', 'D', 'S', 'R']),
    body("payment_status", "Enter valid payment status: I - Initiated, C- Completed, P - Pending").notEmpty().isString().optional().isIn(['I', 'C', 'P']),
	],

	deleteOrder: [
		body("order_id", "Enter valid order id").notEmpty().isString().isMongoId(),
	],
	
	addTrackingDetails: [
		body("order_id", "Enter valid order id").notEmpty().isString().isMongoId(),
		body("tracking_number", "Enter valid tracking number").optional().isString(),
		body("tracking_link", "Enter valid tracking link").optional().isString(),
		body("remarks", "Please enter remarks").optional().isString(),
		body("carrier", "Please enter carrier").optional().isString(),
		body("delivery_date", "Please enter delivery date").optional().isString(),
	]
};
