const { body } = require("express-validator");

module.exports = {
  add: [
    body("product_id", "Enter valid product id")
      .notEmpty()
      .isString()
      .isMongoId(),
    body("quantity", "Enter valid quantity").notEmpty().isNumeric(),
  ],

  updateQuantity: [
    body("product_id", "Enter valid product id")
      .notEmpty()
      .isString()
      .isMongoId(),
    body("quantity", "Enter valid quantity").notEmpty().isNumeric(),
  ],

  checkout: [
    body("cartId", "Enter valid cart id").notEmpty().isString().isMongoId(),
  ],

  removeProductFromCart: [
    body("productId", "Enter valid product id")
      .notEmpty()
      .isString()
      .isMongoId(),
  ],

  verifyOrder: [
    body("paymentId", "Enter valid payment id").notEmpty().isString(),
    body("order_id", "Enter valid order id").notEmpty().isString(),
    body("shippingAddress", "Please provide the shipping address")
      .notEmpty()
      .optional()
      .isString(),
    body("billingAddress", "Please provide the billing address")
      .notEmpty()
      .optional()
      .isString(),
  ],
};
