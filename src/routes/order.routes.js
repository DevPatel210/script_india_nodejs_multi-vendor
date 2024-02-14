const express = require("express");
const order = require("../controller/v1/checkout");
const router = express.Router();

const validate = require("../validations/handler");
const rules = require("../validations/order.validation");
const { isVendor, verifyToken } = require("../middleware/auth.mdl");


router.get("/", validate(rules.getOrder), order.getOrder);

router.post("/update", validate(rules.updateOrder), order.updateOrder);

router.post("/addTrackingDetails", verifyToken, isVendor, validate(rules.addTrackingDetails), order.addTrackingDetails);

router.post("/delete", validate(rules.deleteOrder), order.deleteOrder);

module.exports = router;
