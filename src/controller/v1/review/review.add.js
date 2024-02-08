const Review = require("../../../models/review.model");
const makeMongoDbService = require("../../../services/mongoDbService")({
	model: Review,
});
const { response, resMessage } = require("../../../helpers/common");

exports.add = async (req) => {
	try {
		req.body.user = req.user._id;
		const review = await makeMongoDbService.createDocument(req.body);

		return response(false, resMessage.success, null, review,201);
	} catch (error) {
		console.log(error);
		throw response(true, null, error.message, error.stack,500);
	}
};
