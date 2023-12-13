
const { handleResponse } = require("../../../helpers/common");
const { login } = require("./auth");

exports.login = (req, res) => {
	handleResponse(login(req), res);
};