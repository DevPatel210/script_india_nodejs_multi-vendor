const { Vendor } = require("../../../models/vendor.model");
const makeMongoDbServiceVendor = require("../../../services/mongoDbService")({
	model: Vendor,
});
const _ = require("lodash");
const { hashPassword, comparePassword } = require("../../../services/bcryptService");
const { response, resMessage } = require("../../../helpers/common");

exports.updatePassword = async (req) => {
	try {
		const { oldPassword, newPassword, confirmPassword } = req.body;
		
		// Check if newPassword and confirmPassword match
		if (newPassword !== confirmPassword) {
			return response(true, "New password and confirm password do not match", null, null, 400);
		}
		
		// Get the vendor's current password from the database
		const vendor = await makeMongoDbServiceVendor.getSingleDocumentById(req.params.vendorId);
		if (!vendor) {
			return response(true, "Vendor not found", null, null, 404);
		}
		
		// Verify old password
		const isPasswordMatch = await comparePassword(oldPassword, vendor.password);
		if (!isPasswordMatch) {
			return response(true, "Old password is incorrect", null, null, 400);
		}

		// Hash the new password
		const hashedNewPassword = await hashPassword(newPassword);

		// Update password in the database
		const updatedVendor = await makeMongoDbServiceVendor.updateDocument(req.params.vendorId, { password: hashedNewPassword });

		return response(
			false,
			resMessage.success,
			null,
			_.pick(updatedVendor, [
				"_id",
				"first_name",
				"last_name",
				"email",
			]),
			200
		);
	} catch (error) {
		return response(true, null, error.message, error.stack, 500);
	}
};
