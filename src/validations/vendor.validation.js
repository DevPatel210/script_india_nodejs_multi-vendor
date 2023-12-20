const { body, param, query, header, check } = require("express-validator");
const { Vendor } = require("../models/vendor.model");
const makeMongoDbServiceVendor = require("../services/mongoDbService")({
	model: Vendor,
});

module.exports = {
  // POST /api/vendors/add
  createVendor: [
    body("first_name", "Name can not be empty").notEmpty().isString(),
    body("last_name", "Name can not be empty").notEmpty().isString(),
    body("email", "Invalid email").notEmpty().isEmail(),
	body("commission", "Invalid commission").optional().default(0).notEmpty().isFloat({min:0}),
    body(
      "password",
      "Invalid password, password should be atleast 8 characters long"
    )
      .notEmpty()
      .isString()
      .isLength({ min: 8 }),
    body("status", "Invalid status").optional().isIn(["A", "D"]).default('A').notEmpty().isString(),
  ],

	// POST /api/vendor/update
	updateVendor: [
		body("first_name", "Name can not be empty")
			.optional()
			.notEmpty()
			.isString(),
		body("last_name", "Name can not be empty").optional().notEmpty().isString(),
		body("email", "Invalid email").optional().notEmpty().isEmail(),
		body("commission", "Invalid commission").optional().notEmpty().isFloat({min:0}),
		body("password", "Invalid password")
			.optional()
			.notEmpty()
			.isString()
			.isLength({ min: 8 }),
		body("status", "Invalid status")
			.optional()
			.isIn(["A", "D"])
			.default("A")
			.notEmpty()
			.isString(),
	],

	// POST /api/vendor/all
	listVendors: [
		query("pageNumber", "pageNumber parameter should be number")
			.default(1)
			.toInt(),
		query("search", "search parameter should be string").default(" "),
	],

	// GET /api/vendor/:id
	getVendorById: [
		param("id", "Vendor not found with this Id")
			.optional()
			.custom((value) => {
				return makeMongoDbServiceVendor
					.getSingleDocumentById(value)
					.then((vendor) => {
						if (!vendor) {
							return Promise.reject("Vendor not found with this Id");
						}
					});
			}),
	],
};
