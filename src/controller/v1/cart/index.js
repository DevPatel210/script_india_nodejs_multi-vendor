const cartAdd = require("./cart.add");
const cartClear = require("./cart.clear");
const cartGet = require("./cart.get");
const { handleResponse } = require("../../../helpers/common");

exports.add = (req, res) => {
  handleResponse(cartAdd.add(req), res);
};

exports.updateQuantity = (req, res) => {
  handleResponse(cartAdd.updateQuantity(req), res);
};

exports.clear = (req, res) => {
  handleResponse(cartClear.clear(req), res);
};

exports.removeProductFromCart = (req, res) => {
  handleResponse(cartClear.removeProductFromCart(req), res);
};

exports.get = (req, res) => {
  handleResponse(cartGet.get(req), res);
};
