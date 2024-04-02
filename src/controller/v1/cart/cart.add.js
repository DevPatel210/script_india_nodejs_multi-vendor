const { Cart } = require("../../../models/cart.model");
const { response, resMessage } = require("../../../helpers/common");

// exports.add = async (req) => {
//   try {
//     const { product_id, quantity, bean } = req.body;
//     const { _id } = req.user;

//     var result = await Cart.findOne({ user: _id }).then((cart) => {
//       if (cart) {
//         const cartItem = cart.cartItems.find(
//           (item) => item.product.toString() === product_id
//         );
//         if (cartItem) {
//           cartItem.quantity = quantity;
//           cartItem.bean = bean;
//           return cart.save();
//         } else {
//           cart.cartItems.push({
//             product: product_id,
//             quantity: quantity,
//             bean: bean,
//           });
//           return cart.save();
//         }
//       } else {
//         return Cart.create({
//           user: _id,
//           cartItems: [{ product: product_id, quantity: quantity, bean: bean }],
//         });
//       }
//     });

//     return response(false, resMessage.success, null, result, 201);
//   } catch (error) {
//     throw response(true, null, error.message, error.stack, 500);
//   }
// };
exports.add = async (req) => {
  try {
    const { product_id, quantity, bean } = req.body;
    const { _id } = req.user;

    // Find the cart for the current user
    let cart = await Cart.findOne({ user: _id });

    if (cart) {
      // Check if the product already exists in the cart
      const existingCartItem = cart.cartItems.find(
        (item) => item.product.toString() === product_id && item.bean === bean
      );

      if (existingCartItem) {
        // If the product with the same bean already exists, update its quantity
        existingCartItem.quantity += quantity;
      } else {
        // If the product with the same bean doesn't exist, add it to the cart
        cart.cartItems.push({ product: product_id, quantity, bean });
      }

      // Save the updated cart
      cart = await cart.save();
    } else {
      // If the cart doesn't exist, create a new cart and add the product to it
      cart = await Cart.create({
        user: _id,
        cartItems: [{ product: product_id, quantity, bean }],
      });
    }

    return response(false, resMessage.success, null, cart, 201);
  } catch (error) {
    throw response(true, null, error.message, error.stack, 500);
  }
};
