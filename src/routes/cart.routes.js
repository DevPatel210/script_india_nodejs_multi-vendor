const express = require("express");
const router = express.Router();

const validate = require("../validations/handler");
const rules = require("../validations/cart.validation");
const cart = require("../controller/v1/cart");
const order = require("../controller/v1/checkout");

router.post("/add", validate(rules.add), cart.add);

router.post("/clear", cart.clear);

router.post("/removeProduct", validate(rules.removeProductFromCart), cart.removeProductFromCart);

router.get("/get", cart.get);

router.post("/checkout", validate(rules.checkout), order.checkout);

router.post("/verifyPayment", validate(rules.verifyOrder), order.verifyOrder);

module.exports = router;