const { User } = require("../../../models/user.model");
const makeMongoDbServiceUser = require("../../../services/mongoDbService")({
	model: User,
});
const _ = require("lodash");
const { hashPassword } = require("../../../services/bcryptService");
const { response, resMessage } = require("../../../helpers/common");

// Create and Save a new Movie
exports.create = async (req) => {
	try {
		const { email } = req.body;
		// Make sure this account doesn't already exist
		const user = await makeMongoDbServiceUser.getSingleDocumentByQuery(
			{
				email,
			},
			[]
		);
		if (user) {
			return response(true, resMessage.alreadyExist, "null",[],400);
		}
		req.body.password = await hashPassword(req.body.password);
		const userData = req.body;
		const newUser = await makeMongoDbServiceUser.createDocument(userData);

		return response(
			false,
			resMessage.success,
			null,
			_.pick(newUser, [
				"_id",
				"first_name",
				"last_name",
				"email",
				"address",
				"city",
				"state",
				"country",
				"pincode",
				"phone_number",
			]),
			201
		);
	} catch (error) {
		return response(true, null, error.message, error.stack,500);
	}
};
