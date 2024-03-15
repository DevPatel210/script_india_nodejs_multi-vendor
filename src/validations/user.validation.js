const { body, param, query, header, check } = require("express-validator");
const { User } = require("../models/user.model");
const makeMongoDbServiceUser = require("../services/mongoDbService")({
	model: User,
});

module.exports = {
  // POST /api/users/add
  createUser: [
    body("first_name", "Name can not be empty").notEmpty().isString(),
    body("last_name", "Name can not be empty").notEmpty().isString(),
    body("email", "Invalid email").notEmpty().isEmail(),
    body(
      "password",
      "Invalid password, password should be atleast 8 characters long"
    )
      .notEmpty()
      .isString()
      .isLength({ min: 8 }),
    body("address", "Invalid address").notEmpty().isString(),
    body("address2", "Invalid address").optional().isString(),
    body("city", "Invalid address").notEmpty().isString(),
    body("state", "Invalid state").notEmpty().isString(),
    body("country", "Invalid country").notEmpty().isString(),
    body("pincode", "Invalid pincode").notEmpty().isString(),
    body("phone_number", "Invalid phone_number").notEmpty().isNumeric(),
    body("status", "Invalid status").optional().isIn(["A", "D"]).default('A').notEmpty().isString(),
    body('isAdmin').optional()
      .custom((value, { req }) => {
        if (value && req.isAdmin === true) {
          req.body.isAdmin = true;
        } else {
          return false
        }
        return true;
      })
  ],

	// POST /api/users/update
	updateUser: [
		body("first_name", "Name can not be empty")
			.optional()
			.notEmpty()
			.isString(),
		body("last_name", "Name can not be empty").optional().notEmpty().isString(),
		body("email", "Invalid email").optional().notEmpty().isEmail(),
		body("password", "Invalid password")
			.optional()
			.notEmpty()
			.isString()
			.isLength({ min: 8 }),
		body("address", "Invalid address").optional().notEmpty().isString(),
		body("address2", "Invalid address").optional().notEmpty().isString(),
		body("city", "Invalid address").optional().notEmpty().isString(),
		body("state", "Invalid state").optional().notEmpty().isString(),
		body("country", "Invalid country").optional().notEmpty().isString(),
		body("status", "Invalid status")
			.optional()
			.isIn(["A", "D"])
			.default("A")
			.notEmpty()
			.isString(),
		body("pincode", "Invalid pincode").optional().notEmpty().isString(),
		body("phone_number", "Invalid phone_number")
			.optional()
			.notEmpty()
			.isNumeric()
			.isLength({ min: 10 }),
	],

	// POST /api/users/all
	listUsers: [
		query("pageNumber", "pageNumber parameter should be number")
			.default(1)
			.toInt(),
		query("search", "search parameter should be string").default(" "),
	],
	
	// POST /api/users/forgotPassword
	forgotPassword: [
		body("email").notEmpty().isEmail(),
	],
	
	// POST /api/users/resetPassword
	resetPassword: [
		body("userId").notEmpty().isString().isMongoId(),
		body("newPassword").notEmpty().isString().isLength({ min: 8 }),
		body("confirmPassword").notEmpty().isString().isLength({ min: 8 })
	],

	// GET /api/users/:id
	getUserById: [
		param("id", "User not found with this Id")
			.optional()
			.custom((value) => {
				return makeMongoDbServiceUser
					.getSingleDocumentById(value)
					.then((user) => {
						if (!user) {
							return Promise.reject("User not found with this Id");
						}
					});
			}),
	],
};
