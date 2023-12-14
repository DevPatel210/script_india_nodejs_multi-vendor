const vendorGet = require("./vendor.get");
const vendorCreate = require("./vendor.add");
const vendorUpdate = require("./vendor.update");
const vendorDelete = require("./vendor.delete");
const { handleResponse } = require("../../../helpers/common");

exports.create = (req, res) => {
	handleResponse(vendorCreate.create(req), res);
};

exports.findAll = (req, res) => {
	handleResponse(vendorGet.findAll(req), res);
};

exports.findById = (req, res) => {
	handleResponse(vendorGet.findById(req), res);
};

exports.update = (req, res) => {
	handleResponse(vendorUpdate.Update(req), res);
};

exports.deleteVendor = (req, res) => {
	handleResponse(vendorDelete.deleteVendor(req), res);
};
