const { response, resMessage } = require("../../../helpers/common");
const { generateToken } = require("../../../middleware/auth.mdl");
const { User } = require("../../../models/user.model");
const { Vendor } = require("../../../models/vendor.model");
const { comparePassword } = require("../../../services/bcryptService");
const makeMongoDbService = require("../../../services/mongoDbService")({
	model: User,
});
const makeMongoDbServiceVendor = require("../../../services/mongoDbService")({
	model: Vendor,
});

exports.login = async (req) => {
	try {
		let query = { email: req.body.email, status: "A" };
		const user = await makeMongoDbService.getSingleDocumentByQuery(query, []);
		if (!user) {
			return response(
				true,
				resMessage.inCorrectCred,
				"User not found.",
				[],
				404
			);
		}

		let isMatch = await comparePassword(req.body.password, user.password);
		if (!isMatch)
			return response(
				true,
				resMessage.inCorrectCred,
				resMessage.invalidPassword,
				[],
				401
			);

		delete user.password;
		let token = await generateToken(user);
		role = 'user';
		if (user.isAdmin) {
			role = 'admin';
		}
		return response(false, resMessage.loginSuccess, resMessage.loginSuccess, {
			token,
			role: role,
			user
		},200);
	} catch (error) {
		return response(true, null, error.message,[],500);
	}
};

exports.vendorLogin = async (req) => {
	try {
		let query = { email: req.body.email, status: "A" };
		const vendor = await makeMongoDbServiceVendor.getSingleDocumentByQuery(query, []);
		if (!vendor) {
			return response(
				true,
				resMessage.inCorrectCred,
				"Vendor not found.",
				[],
				404
			);
		}

		let isMatch = await comparePassword(req.body.password, vendor.password);
		if (!isMatch)
			return response(
				true,
				resMessage.inCorrectCred,
				resMessage.invalidPassword,
				[],
				401
			);

		delete vendor.password;
		let token = await generateToken(vendor);
		return response(false, resMessage.loginSuccess, resMessage.loginSuccess, {
			token,
			role: 'vendor',
			vendor
		},200);
	} catch (error) {
		return response(true, null, error.message,[],500);
	}
};
