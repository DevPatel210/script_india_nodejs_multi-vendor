const { add: reviewAdd } = require("./review.add");
const { update: reviewUpdate } = require("./review.update");
const {
	getAll: reviewGetAll,
	getById: reviewGetById,
} = require("./review.get");
const { delete: reviewDelete } = require("./review.delete");
const { handleResponse } = require("../../../helpers/common");

exports.add = (req, res) => {
	handleResponse(reviewAdd(req), res);
};

exports.update = (req, res) => {
	handleResponse(reviewUpdate(req), res);
};

exports.getById = (req, res) => {
	handleResponse(reviewGetById(req), res);
};

exports.getAll = (req, res) => {
	handleResponse(reviewGetAll(req), res);
};

exports.delete = (req, res) => {
	handleResponse(reviewDelete(req), res);
};
