const productGet = require("./product.get");
const productAdd = require("./product.add");
const productUpdate = require("./product.update");
const productDelete = require("./product.delete");
const { handleResponse } = require("../../../helpers/common");

exports.create = (req, res) => {
  handleResponse(productAdd.create(req), res);
};

exports.update = (req, res) => {
  handleResponse(productUpdate.Update(req), res);
};

exports.approveProduct = (req, res) => {
  handleResponse(productUpdate.approveProduct(req), res);
};

exports.unApproveProduct = (req, res) => {
  handleResponse(productUpdate.unApproveProduct(req), res);
};

exports.findAll = (req, res) => {
  handleResponse(productGet.findAll(req), res);
};


exports.findById = (req, res) => {
  handleResponse(productGet.findById(req), res);
};

exports.delete = (req, res) => {
	handleResponse(productDelete.delete(req), res);
  };