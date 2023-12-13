const Review = require("../../../models/review.model");
const makeMongoDbService = require("../../../services/mongoDbService")({
	model: Review,
});
const { response, resMessage } = require("../../../helpers/common");

exports.getById = async (req) => {
	try {
		let isReview = await makeMongoDbService.getSingleDocumentById(req.query.reviewId);
		if (!isReview || isReview.status == "D") {
			return response(true, resMessage.notFound, resMessage.notFound);
		}
		return response(false, null, resMessage.success, isReview);
	} catch (error) {
		return response(true, null, error.message, error.stack);
	}
};

exports.getAll = async (req) => {
	try {
		const product_id = req.query.productId;
		let reviews;
		if (product_id) {
			reviews = await makeMongoDbService.getDocumentByQueryPopulate({
				product: product_id,
			},null,["user","product"]);
		} else {
			reviews = await makeMongoDbService.getDocumentByQueryPopulate({}, null, [
				"user",
				"product",
			]);
		}
		if (reviews.length == 0) {
			return response(true, resMessage.notFound, resMessage.notFound);
		}
		return response(false, null, resMessage.success, reviews);
	} catch (error) {
		console.log(error);
		return response(true, null, error.message);
	}
};
