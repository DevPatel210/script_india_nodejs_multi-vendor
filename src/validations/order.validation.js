const { body, query } = require("express-validator");

module.exports = {
	getOrder: [
		query("order_id", "Enter valid order id").notEmpty().optional().isString().isMongoId(),
		query("pageNumber", "pageNumber parameter should be number").default(1).toInt(),
	],

	updateOrder: [
		body("order_id", "Enter valid order id").notEmpty().isString().isMongoId(),
		body("status", "Enter valid status: A - Accepted, C- Cancelled, P - Pending, D - Deleted, S - Shipped, R - Received").notEmpty().isString().isIn(['A','C', 'P', 'D', 'S', 'R']),
    body("payment_status", "Enter valid payment status: I - Initiated, C- Completed, P - Pending").notEmpty().isString().optional().isIn(['I', 'C', 'P']),
	],

	deleteOrder: [
		body("order_id", "Enter valid order id").notEmpty().isString().isMongoId(),
	],
	
	addTrackingDetails: [
		body("order_id", "Enter valid order id").notEmpty().isString().isMongoId(),
		body("tracking_number", "Enter valid tracking number").notEmpty().isString(),
		body("tracking_link", "Enter valid tracking link").notEmpty().isString(),
		body("remarks", "Please enter remarks").notEmpty().isString(),
	]
};
