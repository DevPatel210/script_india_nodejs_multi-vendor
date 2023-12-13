const { Cart } = require("../../../models/cart.model");
const makeMongoDbService = require("../../../services/mongoDbService")({
	model: Cart,
});
const { response, resMessage } = require("../../../helpers/common");

exports.clear = async (req) => {
	try {
		const { _id } = req.user;

		const result = await makeMongoDbService.bulkUpdate(
			{ user: _id },
			{ $set: { cartItems: [] } }
		);

		return response(false, resMessage.success, null, result);
	} catch (error) {
		throw response(true, null, error.message, error.stack);
	}
};
