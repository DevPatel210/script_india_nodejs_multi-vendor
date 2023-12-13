const express = require("express");
const router = express.Router();

const validate = require("../validations/handler");
const rules = require("../validations/auth.vallidation");
const auth = require("../controller/v1/auth");

// @route   POST /api/auth/login
router.post("/login", validate(rules.login), auth.login);

module.exports = router;