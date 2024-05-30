const express = require("express");
const order = require("../controller/v1/checkout");
const router = express.Router();
const validate = require("../validations/handler");
const rules = require("../validations/order.validation");
const { isVendor, verifyToken, isAdmin } = require("../middleware/auth.mdl");
const { handleAttachmentFile } = require("../services/multerService");

router.get(
  "/",
  validate(rules.getOrder),
  verifyToken,
  isAdmin,
  isVendor,
  order.getOrder
);

router.get(
  "/getPaid",
  isVendor,
  isAdmin,
  validate(rules.getOrderPaid),
  order.getOrderPaid
);

router.get(
  "/getShipped",
  isVendor,
  isAdmin,
  validate(rules.getOrderShipped),
  order.getOrderShipped
);

router.get(
  "/getCancel",
  isVendor,
  isAdmin,
  validate(rules.getOrderCancel),
  order.getOrderCancel
);

router.get(
  "/getPaymentFailed",
  isVendor,
  isAdmin,
  validate(rules.getOrderPaymentFailed),
  order.getOrderPaymentFailed
);

router.get(
  "/getByDate",
  validate(rules.getOrdersByDate),
  isVendor,
  isAdmin,
  order.getOrdersByDate
);

router.post("/update", validate(rules.updateOrder), order.updateOrder);

router.post(
  "/addTrackingDetails",
  verifyToken,
  isVendor,
  isAdmin,
  handleAttachmentFile,
  validate(rules.addTrackingDetails),
  order.addTrackingDetails
);

router.post("/delete", validate(rules.deleteOrder), order.deleteOrder);

router.post("/cancel", validate(rules.deleteOrder), order.cancelOrder);

module.exports = router;
