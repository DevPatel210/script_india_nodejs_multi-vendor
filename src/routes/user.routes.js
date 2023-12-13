const express = require("express");
const router = express.Router();

const validate = require("../validations/handler");
const rules = require("../validations/user.validation");
const user = require("../controller/v1/user");
const { verifyToken, isAdmin } = require("../middleware/auth.mdl");

// Create a new user
router.post("/add", isAdmin,validate(rules.createUser), user.create);

// Retrieve all user
router.get("/all", verifyToken, validate(rules.listUsers), user.findAll);

// Retrieve a single user with id
router.get("/", verifyToken, user.findById);

// Update a user
router.post("/update", verifyToken, validate(rules.updateUser), user.update);

// Delete a user
router.post("/delete", verifyToken, user.deleteUser);

module.exports = router;
