const Review = require("../../../models/review.model");
const { Order } = require("../../../models/order.model");
const makeMongoDbService = require("../../../services/mongoDbService")({
	model: Review,
});
const makeMongoDbServiceOrder = require("../../../services/mongoDbService")({
	model: Order,
});
const { response, resMessage } = require("../../../helpers/common");

exports.add = async (req) => {
	try {
		req.body.user = req.user._id;
		let matchCondition = { 
			$and: [
				{ status: { $ne: 'D' } },
				{ user_id: req.user._id }
			]
    };
		const orders = await makeMongoDbServiceOrder.getDocumentByQuery(matchCondition);
		
		const isProductOrdered = orders.find((order)=> {
			for (let product of order.accounting.cartAccountingList) {
				if (product.productId.toString() == req.body.product) {
					return true;
				}
			}
			return false;
		})

		if (!isProductOrdered) {
			return response(false, 'Cannot add review for a product which is not ordered', null, null,400);
		}

		const review = await makeMongoDbService.createDocument(req.body);

		return response(false, resMessage.success, null, review,201);
	} catch (error) {
		console.log(error);
		throw response(true, null, error.message, error.stack,500);
	}
};
