const express = require("express");
const router = express.Router();
const userRoutes = require("./user.routes");
const vendorRoutes = require("./vendor.routes");
const authRoutes = require("./auth.routes");
const productRoutes = require("./product.routes");
const reviewRoutes = require("./review.routes");
const cartRoutes = require("./cart.routes");
const orderRoutes = require("./order.routes");
const { verifyToken } = require("../middleware/auth.mdl");

router.use("/user", userRoutes);

router.use("/vendor", verifyToken, vendorRoutes);

router.use("/auth", authRoutes);

router.use("/product", productRoutes);

router.use("/cart", verifyToken, cartRoutes);

router.use("/review", verifyToken, reviewRoutes);

router.use("/order", verifyToken, orderRoutes);

module.exports = router;
