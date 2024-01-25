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
