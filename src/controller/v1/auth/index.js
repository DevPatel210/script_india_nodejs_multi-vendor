
const { handleResponse } = require("../../../helpers/common");
const { login, vendorLogin } = require("./auth");

exports.login = (req, res) => {
	handleResponse(login(req), res);
};

exports.vendorLogin = (req, res) => {
	handleResponse(vendorLogin(req), res);
};