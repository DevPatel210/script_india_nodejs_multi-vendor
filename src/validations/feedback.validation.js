const { body, param, query, header } = require("express-validator");

module.exports = {
	add: [
		body("name", "Enter a valid name").isString(),
		body("email", "Enter valid email id").isEmail(),
		body("message", "Enter a message").isString(),
	],

	update: [
		body("id", "Enter a valid id").isString().isMongoId(),
		body("product", "Enter a valid product").optional().isString().isMongoId(),
		body("rating", "Enter rating between 1 to 5")
			.optional()
			.isInt({ min: 1, max: 5 }),
		body("comment", "Enter comment").optional().isString().isLength({ min: 1 }),
		body("status", "Enter Valid Status")
			.optional()
			.isString()
			.isIn(["A", "D"])
			.isLength({ min: 1 }),
	],

	getById: [query("reviewId", "Enter a valid id").isString().isMongoId()],

	getAll: [
		query("productId", "Enter a valid product id")
			.optional()
			.isString()
			.isMongoId(),
	],

	delete: [body("id", "Enter a valid id").isString().isMongoId()],
};
