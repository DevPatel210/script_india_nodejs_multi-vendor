const { response, resMessage } = require("../../../helpers/common");
const { Cart } = require("../../../models/cart.model");
const { Vendor } = require("../../../models/vendor.model");
const { createPaymentIntent } = require("../../../services/payment");
const { Order } = require("../../../models/order.model");

const makeMongoDbServiceCart = require("../../../services/mongoDbService")({
	model: Cart,
});
const makeMongoDbServiceOrder = require("../../../services/mongoDbService")({
	model: Order,
});
const makeMongoDbServiceVendor = require("../../../services/mongoDbService")({
	model: Vendor,
});

exports.accounting = async (req) => {
    try {
        let cartId = req.body.cartId;
        let orderAccounting = {};
		let cartAccountingList = [];
		let vendors = await makeMongoDbServiceVendor.getDocumentByQuery({
			status: { $ne: 'D'}
		});
		vendors = vendors.reduce((obj, item) => (obj[item._id] = item, obj) ,{});
		let cartData = await makeMongoDbServiceCart.getSingleDocumentByIdPopulate(
			cartId,
			null,
			["cartItems.product"]
		);
		let cartItems = cartData.cartItems;
		const vendorset = new Set();
		for (const productListitem of cartItems) {
			var newProduct = productListitem.product;
			var cartAccountingItem = {};
			cartAccountingItem["productId"] = newProduct._id;
			cartAccountingItem["vendorId"] = newProduct.vendor;
			vendorset.add(newProduct.vendor);
			cartAccountingItem["productName"] = newProduct.title || "";
			cartAccountingItem["unitPrice"] = newProduct.price || 0;
			let vendor = vendors[newProduct.vendor];
			if(!vendor || !vendor.commission){
				vendor = {commission: 0};
			}
			cartAccountingItem["unitCommission"] = (cartAccountingItem["unitPrice"]*vendor.commission)/100;
			cartAccountingItem["finalUnitPrice"] = cartAccountingItem["unitPrice"]+cartAccountingItem["unitCommission"];
			cartAccountingItem["quantity"] = productListitem.quantity;
			cartAccountingItem["totalCommission"] = cartAccountingItem["unitCommission"] * cartAccountingItem["quantity"];
			cartAccountingItem["totalPrice"] = cartAccountingItem["finalUnitPrice"] * cartAccountingItem["quantity"];
            cartAccountingList.push(cartAccountingItem);
		}

		let finalTotal = 0;
		for (let index = 0; index < cartAccountingList.length; index++) {
            const cartAccountingItem = cartAccountingList[index];
            finalTotal += cartAccountingItem["totalPrice"];
        }
        orderAccounting.finalTotal = parseInt(finalTotal);
		orderAccounting.cartAccountingList = cartAccountingList;
		let payload = {
			cart_id: cartId,
			amountToCharge: orderAccounting.finalTotal,
		};
        console.log(orderAccounting);
		var paymentCred = await createPaymentIntent(payload);
        var paymentId = paymentCred.id;

		await makeMongoDbServiceOrder.createDocument({
			user_id: req.user._id,
			cart_id: cartId,
			vendors: Array.from(vendorset),
			accounting: orderAccounting,
			paymentId: paymentId,
			payment_status: "I",
		});

		return response(false, resMessage.success, null, {
			...orderAccounting,
			paymentId,
		});
	} catch (error) {
		throw response(true, null, error.message, error.stack);
	}
};
