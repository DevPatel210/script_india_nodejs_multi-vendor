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

exports.removeProductFromCart = async (req) => {
	try {
		const { _id } = req.user;
		const {productId} = req.body;
		console.log({_id,productId})
		const cart = await Cart.findOne({ user: _id })
		console.log(cart)
		if (cart) {
			const cartItemIndex = cart.cartItems.findIndex(
				(item) => item.product.toString() === productId
			);
			if (cartItemIndex != -1) {
				cart.cartItems.splice(cartItemIndex,1);
				await cart.save();
			} else {
				return response(true, resMessage.productNotFoundInCart, null);
			}
		} else {
			return response(true, 'Cart '+resMessage.notFound, null);
		}

		return response(false, resMessage.success, null, cart);
	} catch (error) {
		console.log(error)
		throw response(true, null, error.message, error.stack);
	}
}
