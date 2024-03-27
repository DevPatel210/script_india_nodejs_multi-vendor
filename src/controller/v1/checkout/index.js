const { handleResponse } = require("../../../helpers/common");
const order = require("./order.accounting");
const vOrder = require("./order.verfiy");
const getOrder = require("./order");

exports.checkout = (req, res) => {
    handleResponse(order.accounting(req), res);
};

exports.verifyOrder = (req, res) => {
    handleResponse(vOrder.verifyOrder(req), res);
};

exports.getOrder = (req, res) => {
    handleResponse(getOrder.get(req), res);
};

exports.getOrderPaid = (req, res) => {
    handleResponse(getOrder.getPaid(req), res);
}

exports.getOrdersByDate = (req, res) => {
    handleResponse(getOrder.getByDate(req), res);
};

exports.updateOrder = (req, res) => {
    handleResponse(getOrder.update(req), res);
};

exports.deleteOrder = (req, res) => {
    handleResponse(getOrder.delete(req), res);
};

exports.cancelOrder = (req, res) => {
    handleResponse(getOrder.cancel(req), res);
};

exports.addTrackingDetails = (req, res) => {
    handleResponse(getOrder.addTrackingDetails(req), res);
};