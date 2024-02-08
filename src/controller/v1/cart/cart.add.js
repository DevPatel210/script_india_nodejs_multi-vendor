const { Cart } = require("../../../models/cart.model");
const { response, resMessage } = require("../../../helpers/common");

exports.add = async (req) => {
	try {
		const { product_id, quantity } = req.body;
		const { _id } = req.user;

		var result = await Cart.findOne({ user: _id }).then((cart) => {
			if (cart) {
				const cartItem = cart.cartItems.find(
					(item) => item.product.toString() === product_id
				);
				if (cartItem) {
					cartItem.quantity = quantity;
					return cart.save();
				} else {
					cart.cartItems.push({ product: product_id, quantity: quantity });
					return cart.save();
				}
			} else {
				return Cart.create({
					user: _id,
					cartItems: [{ product: product_id, quantity: quantity }],
				});
			}
		});
		
		return response(false, resMessage.success, null, result,201);
	} catch (error) {
		throw response(true, null, error.message, error.stack,500);
	}
};
