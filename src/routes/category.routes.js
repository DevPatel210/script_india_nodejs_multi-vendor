const express = require("express");
const router = express.Router();
const { handleImageFile } = require("../services/multerService");
const validate = require("../validations/handler");
const rules = require("../validations/category.validation");
const category = require("../controller/v1/category");
const { verifyToken, isAdmin, isVendor } = require("../middleware/auth.mdl");

// Create a new category
router.post("/add", isAdmin,handleImageFile, validate(rules.addCategory), category.create);

// Retrieve all categories
router.get("/all", verifyToken, validate(rules.listCategory), category.findAll);

// Retrieve a single category with id
router.get("/", verifyToken, category.findById);

// Update a category
router.post("/update", isAdmin, validate(rules.updateCategory), category.update);

// Delete a category
router.post("/delete", isAdmin, category.delete);

module.exports = router;
