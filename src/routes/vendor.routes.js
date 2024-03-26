const express = require("express");
const router = express.Router();

const validate = require("../validations/handler");
const rules = require("../validations/vendor.validation");
const vendor = require("../controller/v1/vendor");
const { verifyToken, isAdmin, isVendor } = require("../middleware/auth.mdl");
const { handleImageFile } = require("../services/multerService");

// Create a new vendor
router.post("/add", isAdmin, handleImageFile, validate(rules.createVendor), vendor.create);

// Retrieve all vendors
router.get("/all", validate(rules.listVendors), vendor.findAll);

// Retrieve a single vendor with id
router.get("/", verifyToken, vendor.findById);

// Retrieve all the products in the cart by users for a vendor
router.get("/getAllCartProducts", verifyToken, isVendor, vendor.getAllCartProducts);

// Update a vendor
router.post("/update", isVendor, handleImageFile, validate(rules.updateVendor), vendor.update);

// Delete a vendor
router.post("/delete", isAdmin, vendor.deleteVendor);

router.post("/updatePassword/:vendorId", isVendor, validate(rules.updatePassword), vendor.updatePassword);


module.exports = router;
