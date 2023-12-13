const Review = require("../../../models/review.model");
const makeMongoDbService = require("../../../services/mongoDbService")({
	model: Review,
});
const { response, resMessage } = require("../../../helpers/common");

exports.delete = async (req) => {
	try {
		let isReview = await makeMongoDbService.getSingleDocumentById(req.body.id);
		if (!isReview || isReview.status == "D") {
			return response(true, resMessage.notFound, null);
		}
		const deletedReview = await makeMongoDbService.softDeleteDocument({
			_id: req.body.id,
		});

		return response(false, resMessage.success, null);
	} catch (error) {
		return response(true, null, error.message, error.stack);
	}
};
