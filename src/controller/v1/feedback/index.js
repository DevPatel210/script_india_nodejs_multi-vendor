const { add: feedbackAdd } = require("./feedback.add");
const { handleResponse } = require("../../../helpers/common");

exports.add = (req, res) => {
	handleResponse(feedbackAdd(req), res);
};