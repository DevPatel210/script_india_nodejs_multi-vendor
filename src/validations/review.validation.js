const { body, param, query, header } = require("express-validator");

module.exports = {
	add: [
		body("product", "Enter a valid product").isString().isMongoId(),
		body("rating", "Enter rating between 1 to 5").isInt({ min: 1, max: 5 }),
		body("comment", "Enter comment").isString().isLength({ min: 1 }),
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
