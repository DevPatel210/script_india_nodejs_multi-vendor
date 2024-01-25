const express = require("express");
const router = express.Router();
const count = require("../controller/v1/count")
const { verifyToken, isAdmin } = require("../middleware/auth.mdl");

// Get all users count
router.get("/user", count.user);

// Get all vendors count
router.get("/vendor", count.vendor);

// Get all products count
router.get("/product", count.product);

// Get all orders count
router.get("/order", count.order);

module.exports = router;
