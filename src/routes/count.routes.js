const express = require("express");
const router = express.Router();
const count = require("../controller/v1/count")
const { verifyToken, isAdmin } = require("../middleware/auth.mdl");

// Get all users count
router.get("/user", isAdmin, count.user);

// Get all vendors count
router.get("/vendor", isAdmin, count.vendor);

// Get all products count
router.get("/product", isAdmin, count.product);

// Get all orders count
router.get("/order", isAdmin, count.order);

module.exports = router;
