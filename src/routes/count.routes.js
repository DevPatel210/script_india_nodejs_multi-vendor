const express = require("express");
const router = express.Router();
const count = require("../controller/v1/count")
const { isVendor, isAdmin } = require("../middleware/auth.mdl");

// Get all users count
router.get("/user", isAdmin, count.user);

// Get all vendors count
router.get("/vendor", isAdmin, count.vendor);

// Get all products count
router.get("/product", isAdmin, count.product);

// Get all orders count
router.get("/order", isAdmin, count.order);

// Get all count for admin
router.get("/all", isAdmin, count.allCounts);

// Get all orders of a vendor count
router.get("/vendor-order", isVendor, count.orderVendor);

// Get all products of a vendor count
router.get("/vendor-product", isVendor, count.productVendor);

// Get all counts for a vendor
router.get("/vendor-all", isVendor, count.allCountsVendor);

module.exports = router;
