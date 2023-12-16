const express = require("express");
const router = express.Router();

const validate = require("../validations/handler");
const rules = require("../validations/product.validation");
const product = require("../controller/v1/product");
const { handleImageFile } = require("../services/multerService");
const { isVendorAuth } = require("../middleware/checkVendor.mdl");
const { verifyToken } = require("../middleware/auth.mdl");

router.post("/add", verifyToken, isVendorAuth, handleImageFile, validate(rules.addProduct), product.create);

router.get("/all", validate(rules.getAllProducts), product.findAll);

router.get("/vendor/all", verifyToken, isVendorAuth, validate(rules.getAllProducts), product.findAll);

router.get("/", validate(rules.getProduct), product.findById);

router.get("/vendor", verifyToken, isVendorAuth, validate(rules.getProduct), product.findById);

router.post("/update", verifyToken, isVendorAuth, handleImageFile, validate(rules.updateProduct), product.update);

router.post("/delete", verifyToken, isVendorAuth, validate(rules.deleteProduct), product.delete);

module.exports = router;
