const countGet = require("./count.get");
const { handleResponse } = require("../../../helpers/common");

exports.user = (req, res) => {
	handleResponse(countGet.user(req), res);
};

exports.vendor = (req, res) => {
	handleResponse(countGet.vendor(req), res);
};

exports.order = (req, res) => {
	handleResponse(countGet.order(req), res);
};

exports.product = (req, res) => {
	handleResponse(countGet.product(req), res);
};

exports.productVendor = (req, res) => {
	handleResponse(countGet.productVendor(req), res);
};

exports.orderVendor = (req, res) => {
	handleResponse(countGet.orderVendor(req), res);
};
