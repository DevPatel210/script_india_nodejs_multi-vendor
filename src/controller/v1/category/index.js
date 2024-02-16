const categoryGet = require("./category.get");
const categoryAdd = require("./category.add");
const categoryUpdate = require("./category.update");
const categoryDelete = require("./category.delete");
const { handleResponse } = require("../../../helpers/common");

exports.create = (req, res) => {
  handleResponse(categoryAdd.create(req), res);
};

exports.update = (req, res) => {
  handleResponse(categoryUpdate.Update(req), res);
};

exports.findAll = (req, res) => {
  handleResponse(categoryGet.findAll(req), res);
};

exports.findById = (req, res) => {
  handleResponse(categoryGet.findById(req), res);
};

exports.delete = (req, res) => {
	handleResponse(categoryDelete.delete(req), res);
  };