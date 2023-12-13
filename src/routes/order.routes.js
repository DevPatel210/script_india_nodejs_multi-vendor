const express = require("express");
const order = require("../controller/v1/checkout");
const router = express.Router();

const validate = require("../validations/handler");
const rules = require("../validations/order.validation");


router.get("/", validate(rules.getOrder), order.getOrder);

router.post("/update", validate(rules.updateOrder), order.updateOrder);

router.post("/delete", validate(rules.deleteOrder), order.deleteOrder);

module.exports = router;
