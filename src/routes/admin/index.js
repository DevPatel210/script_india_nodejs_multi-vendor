const express = require("express");
const router = express.Router();
const { isAdminAuth } = require("../../middleware/checkAdmin.mdl");
const userRoutes = require("../user.routes");

router.use(isAdminAuth);

router.use("/user", userRoutes);

module.exports = router;
