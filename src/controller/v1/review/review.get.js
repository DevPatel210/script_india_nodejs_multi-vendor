const Review = require("../../../models/review.model");
const makeMongoDbService = require("../../../services/mongoDbService")({
	model: Review,
});
const {Product} = require("../../../models/product.model");
const makeMongoDbServiceProduct = require("../../../services/mongoDbService")({
	model: Product,
});
const { response, resMessage } = require("../../../helpers/common");

exports.getById = async (req) => {
	try {
		let isReview = await makeMongoDbService.getSingleDocumentById(req.query.reviewId);
		if (!isReview || isReview.status == "D") {
			return response(true, resMessage.notFound, resMessage.notFound,[],404);
		}
		if (req.isVendor==true) {
			const product = await makeMongoDbServiceProduct.getSingleDocumentById(isReview.product.toString());
			if(product.vendor==req.vendor._id.toString()) {
				return response(false, null, resMessage.success, isReview,200);
			}
			return response(true, resMessage.notFound, resMessage.notFound,[],404);
		}
		return response(false, null, resMessage.success, isReview,200);
	} catch (error) {
		return response(true, null, error.message, error.stack,200);
	}
};

exports.getAll = async (req) => {
	try {
		const product_id = req.query.productId;
		let reviews;
		if (product_id) {
			reviews = await makeMongoDbService.getDocumentByQueryPopulate({
				product: product_id,
				status: { $ne: 'D' }
			},null,["user","product"]);
		} else {
			reviews = await makeMongoDbService.getDocumentByQueryPopulate({status:{ $ne: 'D' }}, null, [
				"user",
				"product",
			]);
		}
		if (req.isVendor==true) {
			reviews = reviews.filter((review)=>review.product.vendor==req.vendor._id.toString())
		}
		if (reviews.length == 0) {
			return response(true, resMessage.notFound, resMessage.notFound,[],404);
		}
		return response(false, null, resMessage.success, reviews,200);
	} catch (error) {
		return response(true, null, error.message,[],500);
	}
};
