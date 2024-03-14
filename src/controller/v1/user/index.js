const userGet = require("./user.get");
const userCreate = require("./user.add");
const userUpdate = require("./user.update");
const userDelete = require("./user.delete");
const { handleResponse } = require("../../../helpers/common");

exports.create = (req, res) => {
	handleResponse(userCreate.create(req), res);
};

exports.findAll = (req, res) => {
	handleResponse(userGet.findAll(req), res);
};

exports.findById = (req, res) => {
	handleResponse(userGet.findById(req), res);
};

exports.update = (req, res) => {
	handleResponse(userUpdate.Update(req), res);
};

exports.deleteUser = (req, res) => {
	handleResponse(userDelete.deleteUser(req), res);
};

exports.forgotPassword = (req, res) => {
	handleResponse(userUpdate.forgotPassword(req), res);
};

exports.resetPassword = (req, res) => {
	handleResponse(userUpdate.resetPassword(req), res);
};
