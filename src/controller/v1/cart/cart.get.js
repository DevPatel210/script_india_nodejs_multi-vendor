const { Cart } = require("../../../models/cart.model");
const makeMongoDbService = require("../../../services/mongoDbService")({
	model: Cart,
});
const { response, resMessage } = require("../../../helpers/common");

exports.get = async (req) => {
	try {
		const { _id } = req.user;

		const result = await makeMongoDbService.getSingleDocumentByQueryPopulate(
			{ user: _id }, null, ["cartItems.product"]
		);

		return response(false, resMessage.success, null, result);
	} catch (error) {
		throw response(true, null, error.message, error.stack);
	}
};
