const { response, resMessage } = require("../../../helpers/common");
const { Cart } = require("../../../models/cart.model");
const { Vendor } = require("../../../models/vendor.model");
const { User } = require("../../../models/user.model");
const { createPaymentIntent } = require("../../../services/payment");
const { Order } = require("../../../models/order.model");
const { Product } = require("../../../models/product.model");
const { sendEmail } = require("../../../services/email");

const makeMongoDbServiceCart = require("../../../services/mongoDbService")({
	model: Cart,
});
const makeMongoDbServiceOrder = require("../../../services/mongoDbService")({
	model: Order,
});
const makeMongoDbServiceVendor = require("../../../services/mongoDbService")({
	model: Vendor,
});
const makeMongoDbServiceProduct = require("../../../services/mongoDbService")({
	model: Product,
});
const makeMongoDbServiceUser = require("../../../services/mongoDbService")({
	model: User,
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
		let products = await makeMongoDbServiceProduct.getDocumentByQuery({
			status: { $ne: 'D'}
		});
		products = products.reduce((obj, item) => (obj[item._id] = item, obj) ,{});
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
			vendorset.add(newProduct.vendor.toString());
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
		var paymentCred = await createPaymentIntent(payload);
    var paymentId = paymentCred.id;

		let shippingAddress = req.body.shippingAddress;
		if (!shippingAddress) {
			const user = await makeMongoDbServiceUser.getDocumentById(req.user._id);
			shippingAddress = user.address
		}

		await makeMongoDbServiceOrder.createDocument({
			user_id: req.user._id,
			cart_id: cartId,
			vendors: Array.from(vendorset),
			vendorNames: Array.from(vendorset).map((id)=>`${vendors[id].first_name} ${vendors[id].last_name} ${id}`),
			shippingAddress,
			accounting: orderAccounting,
			paymentId: paymentId,
			payment_status: "I",
			trackingDetails:{}
		});

		orderAccounting.cartAccountingList = orderAccounting.cartAccountingList.map((list) => {
			const productDetails = products[list.productId.toString()]
			return {
				...list,
				productDetails: (!productDetails) ? {} : productDetails
			}
		})
		const message = getOrderPlacedMessage({...orderAccounting,
			vendorNames: Array.from(vendorset).map((id)=>`${vendors[id].first_name} ${vendors[id].last_name}`),
			shippingAddress,
			trackingDetails: {},
			paymentId,
		})
		await sendEmail(req.user.email,'Order Placed', message);
		return response(false, resMessage.success, null, {
			...orderAccounting,
			vendorNames: Array.from(vendorset).map((id)=>`${vendors[id].first_name} ${vendors[id].last_name}`),
			shippingAddress,
			trackingDetails: {},
			paymentId,
		},200);
	} catch (error) {
		throw response(true, null, error.message, error.stack,500);
	}
};

function getOrderPlacedMessage(order){
	const productList = order.cartAccountingList.map((product)=>{
		return `<li>
			Title: ${product.productDetails.title} <br>
			Sub title: ${product.productDetails.subTitle} <br>
			Author: ${product.productDetails.author} <br>
			Description: ${product.productDetails.description} <br>
			Category: ${product.productDetails.category} <br>
			Unit Price: $ ${product.finalUnitPrice} <br>
			Quantity: ${product.quantity} <br>
			Total Price: $ ${product.totalPrice} <br>
		</li>`
	});

	return `
		Dear customer,<br>
		Your order is placed successfully. Please find the details of your order below: 
		<br>
		<h4>Products List:</h4>
		<ul>
			${productList.join('')}
		</ul>

		<h4>Shipping Address:</h4> ${order.shippingAddress}
		<h4>Final Price:</h4> $ ${order.finalTotal}
	`
}