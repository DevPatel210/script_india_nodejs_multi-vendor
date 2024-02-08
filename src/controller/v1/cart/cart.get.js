const { Cart } = require("../../../models/cart.model");
const { Vendor } = require("../../../models/vendor.model");
const makeMongoDbService = require("../../../services/mongoDbService")({
	model: Cart,
});
const makeMongoDbServiceVendor = require("../../../services/mongoDbService")({
	model: Vendor,
});
const { response, resMessage } = require("../../../helpers/common");

exports.get = async (req) => {
	try {
		const { _id } = req.user;
		let vendors = await makeMongoDbServiceVendor.getDocumentByQuery({
			status: { $ne: 'D'}
		});
		vendors = vendors.reduce((obj, item) => (obj[item._id] = item, obj) ,{});

		let result = await makeMongoDbService.getSingleDocumentByQueryPopulate(
			{ user: _id }, null, ["cartItems.product"]
		);

		let cartItems = [];
		for(let product of result.cartItems) {
			quantity = product._doc.quantity;
			product = product._doc.product;
			let vendor = vendors[product.vendor];
			if (!vendor || vendor.status == "D") {
				vendor = {commission: 0};
			}
			cartItems.push({
				...product._doc,
				quantity,
				commission: ((product.price*quantity*vendor.commission)/100),
				finalPrice: (product.price + ((product.price*vendor.commission)/100))*quantity,
				vendor: (!vendor || vendor.status == "D") ? {} : vendor
			});
		}
		finalResult = {
			id: result.id,
			user: result.user,
			cartItems: cartItems
		}
		return response(false, resMessage.success, null, finalResult,200);
	} catch (error) {
		throw response(true, null, error.message, error.stack,500);
	}
};
