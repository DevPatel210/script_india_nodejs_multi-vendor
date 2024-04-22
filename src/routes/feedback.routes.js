const express = require("express");
const feedback = require("../controller/v1/feedback");
const router = express.Router();

const validate = require("../validations/handler");
const rules = require("../validations/feedback.validation");

router.post("/add", validate(rules.add), feedback.add);

module.exports = router;
