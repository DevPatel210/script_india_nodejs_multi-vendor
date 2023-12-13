const { body } = require("express-validator");

module.exports = {
	add: [
		body("product_id", "Enter valid product id").notEmpty().isString().isMongoId(),
		body("quantity", "Enter valid quantity").notEmpty().isNumeric(),
	],

	checkout: [
		body("cartId", "Enter valid cart id").notEmpty().isString().isMongoId(),
	],

	verifyOrder: [
		body("paymentId", "Enter valid payment id").notEmpty().isString(),
	]
};
