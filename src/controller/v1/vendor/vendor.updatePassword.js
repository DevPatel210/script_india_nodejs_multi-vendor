const { Vendor } = require("../../../models/vendor.model");
const makeMongoDbServiceVendor = require("../../../services/mongoDbService")({
	model: Vendor,
});
const _ = require("lodash");
const { hashPassword, comparePassword } = require("../../../services/bcryptService");
const { response, resMessage } = require("../../../helpers/common");

const { validationResult } = require("express-validator");

exports.updatePassword = async (req) => {
    try {
        const errors = validationResult(req);

        // Initialize techMsg object to collect all error messages
        let techMsg = {};

        // Check if there are validation errors
        if (!errors.isEmpty()) {
            // Collect all error messages into techMsg object
            errors.array().forEach(error => {
                techMsg[error.param] = error.msg;
            });
        }

        // No validation errors, proceed with password update logic
        const { oldPassword, newPassword, confirmPassword } = req.body;
        
        // Check if newPassword and confirmPassword match
        if (newPassword !== confirmPassword) {
            techMsg.confirmPassword = "Confirm password does not match new password";
        }
        
        // Get the vendor's current password from the database
        const vendor = await makeMongoDbServiceVendor.getSingleDocumentById(req.params.vendorId);
        if (!vendor) {
            techMsg.vendor = "Vendor not found";
        }
        
        // Verify old password
        const isPasswordMatch = await comparePassword(oldPassword, vendor.password);
        if (!isPasswordMatch) {
            techMsg.oldPassword = "Old password is incorrect";
        }

        // Check if techMsg object is empty
        if (Object.keys(techMsg).length > 0) {
            // Return response with techMsg containing all error messages
            return response(true, "The request cannot be fulfilled due to bad syntax", null, techMsg, 400);
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
