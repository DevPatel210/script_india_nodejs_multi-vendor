const Review = require("../../../models/review.model");
const makeMongoDbService = require("../../../services/mongoDbService")({
	model: Review,
});
const { response, resMessage } = require("../../../helpers/common");

exports.update = async (req) => {
	try {
		let isReview = await makeMongoDbService.getSingleDocumentById(req.body.id);
		if (!isReview) {
			return response(true, resMessage.notFound, null);
		}
		const reviewData = req.body; // update product payload
		const updatedReview = await makeMongoDbService.findOneAndUpdateDocument(
			{ _id: req.body.id },
			reviewData
		);

		return response(false, resMessage.success, null, updatedReview);
	} catch (error) {
		return response(true, null, error.message, error.stack);
	}
};
