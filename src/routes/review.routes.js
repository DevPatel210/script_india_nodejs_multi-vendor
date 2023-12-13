const express = require("express");
const review = require("../controller/v1/review");
const router = express.Router();

const validate = require("../validations/handler");
const rules = require("../validations/review.validation");

router.post("/add", validate(rules.add), review.add);

router.get("/all", validate(rules.getAll), review.getAll);

router.get("/", validate(rules.getById), review.getById);

router.post("/update", validate(rules.update), review.update);

router.post("/delete", validate(rules.delete), review.delete);

module.exports = router;
