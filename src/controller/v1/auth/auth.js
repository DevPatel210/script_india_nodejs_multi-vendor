const { response, resMessage } = require("../../../helpers/common");
const { generateToken } = require("../../../middleware/auth.mdl");
const { User } = require("../../../models/user.model");
const { comparePassword } = require("../../../services/bcryptService");
const makeMongoDbService = require("../../../services/mongoDbService")({
	model: User,
});

exports.login = async (req) => {
	try {
		let query = { email: req.body.email, status: "A" };
		const user = await makeMongoDbService.getSingleDocumentByQuery(query, []);
		if (!user) {
			return response(
				true,
				resMessage.inCorrectCred,
				"User not found."
			);
		}

		let isMatch = await comparePassword(req.body.password, user.password);
		if (!isMatch)
			return response(
				true,
				resMessage.inCorrectCred,
				resMessage.invalidPassword
			);

		delete user.password;
		let token = await generateToken(user);
		return response(false, resMessage.loginSuccess, resMessage.loginSuccess, {
			token,
			user
		});
	} catch (error) {
		return response(true, null, error.message);
	}
};
