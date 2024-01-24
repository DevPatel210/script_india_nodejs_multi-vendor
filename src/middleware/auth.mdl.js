const jwt = require("jsonwebtoken");
const { User } = require("../models/user.model");
const { Vendor } = require("../models/vendor.model");
const { response, resMessage } = require("../helpers/common");
const makeMongoDbService = require("../services/mongoDbService")({
	model: User,
});
const makeMongoDbServiceVendor = require("../services/mongoDbService")({
	model: Vendor,
});

exports.verifyToken = async (req, res, next) => {
	try {
		if (
			!req.headers ||
			!req.headers.authorization ||
			!req.headers.authorization.startsWith("Bearer ")
		)
			return res
				.status(200)
				.json(response(true, resMessage.unAuthorized, null));

		const token = req.headers.authorization.split(" ")[1];
		let decoded = "";
		try {
			decoded = await jwt.verify(
				token,
				process.env.JWT_SECRET,
				(err, decoded) => {
					if (err) {
						throw err;
					}
					return decoded;
				}
			);
		} catch (error) {
			return res
				.status(200)
				.json(response(true, resMessage.unAuthorized, resMessage.invalidToken));
		}

		const user = await makeMongoDbService.getDocumentById(decoded._id);
		const vendor = await makeMongoDbServiceVendor.getDocumentById(decoded._id);
		if (user) {
			req.user = user;
			next();
		} else if (vendor) {
			req.vendor = vendor;
			req.isVendor = true;
			next();
		} else {
			return res
				.status(200)
				.json(
					response(true, resMessage.userNotFound, resMessage.invalidToken, {})
				);
		}
	} catch (error) {
		return res
			.status(200)
			.json(response(true, resMessage.failed, error.message, {}));
	}
};

exports.isAdmin = async (req, res, next) => {
	try {
		if (
			req.headers ||
			req.headers.authorization ||
			req.headers.authorization.startsWith("Bearer ")
		) {
			const token = req.headers.authorization.split(" ")[1];
			const decoded = jwt.verify(
				token,
				process.env.JWT_SECRET,
				(err, decoded) => {
					if (err) {
						return res
							.status(200)
							.json(response(true, null, resMessage.invalidToken));
					}
					return decoded;
				}
			);	
			if (decoded._id === "65af9e83bf2db94e4cf483be") {
				req.isAdmin = true;
				next();
			} else {
				req.isAdmin = false;
				next();
			}
		} else {
			next();
		}
	} catch (error) {
		next();
	}
};

exports.isVendor = async (req, res, next) => {
	try {
		if (
			req.headers ||
			req.headers.authorization ||
			req.headers.authorization.startsWith("Bearer ")
		) {
			const token = req.headers.authorization.split(" ")[1];
			const decoded = jwt.verify(
				token,
				process.env.JWT_SECRET,
				(err, decoded) => {
					if (err) {
						return res
							.status(200)
							.json(response(true, null, resMessage.invalidToken));
					}
					return decoded;
				}
			);
			const vendor = await makeMongoDbServiceVendor.getDocumentById(decoded._id);
			if (!vendor) {
				req.isVendor = false;
				next();
			} else {
				req.isVendor = true;
				next();
			}
		} else {
			next();
		}
	} catch (error) {
		next();
	}
};

exports.generateToken = (user) => {
	return jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
		expiresIn: "1d",
	});
};
