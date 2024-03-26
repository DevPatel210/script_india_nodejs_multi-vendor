const bcrypt = require("bcrypt");
const { User } = require("../../../models/user.model");
const makeMongoDbServiceUser = require("../../../services/mongoDbService")({
  model: User,
});
const _ = require("lodash");
const { response, resMessage } = require("../../../helpers/common");
const { sendEmail } = require("../../../services/email");
const { hashPassword, comparePassword } = require("../../../services/bcryptService");

// Update user
exports.Update = async (req) => {
  try {
    const id = (req.user && req.user.isAdmin) ? req.body.id : req.user._id;
    let isuser = await makeMongoDbServiceUser.getDocumentById(id);

    if (!isuser) {
      return response(true, resMessage.userNotFound, null,[],404);
    }
    const userData = req.body; // update user payload
    const updatedUser = await makeMongoDbServiceUser.findOneAndUpdateDocument(
      { _id: id },
      userData
    );

    return response(false, resMessage.userUpdated, null, updatedUser,200);
  } catch (error) {
    return response(true, null, error.message, error.stack,500);
  }
};

// forgot password
exports.forgotPassword = async (req) => {
  try {
    const email = req.body.email;
    let isuser = await makeMongoDbServiceUser.getDocumentByQuery({email});

    if (!isuser || isuser.length==0) {
      return response(true, resMessage.userNotFound, null,[],404);
    }

    const message = getForgotPasswordMessage(isuser[0]._id.toString());
		await sendEmail(isuser[0].email,'Reset Your Password', message, true);

    return response(false, 'Forgot password email sent successfully', null, {userId: isuser[0]._id.toString()},200);
  } catch (error) {
    return response(true, null, error.message, error.stack,500);
  }
};

// reset password
exports.resetPassword = async (req) => {
  try {
    const id = req.body.userId;
    let isuser = await makeMongoDbServiceUser.getDocumentByQuery({_id: id});

    if (!isuser || isuser.length==0) {
      return response(true, resMessage.userNotFound, null,[],404);
    }

    isuser = isuser[0];
    const { newPassword, confirmPassword } = req.body;
        
    // Check if newPassword and confirmPassword match
    if (newPassword !== confirmPassword) {
      return response(false, 'Confirm password does not match new password', null, null,400);
    }

    // Hash the new password
    const hashedNewPassword = await hashPassword(newPassword);

    // Update password in the database
    const updatedUser = await makeMongoDbServiceUser.updateDocument(isuser._id, { password: hashedNewPassword });

    return response(false, 'Password updated succfully', null, updatedUser,200);
  } catch (error) {
    return response(true, null, error.message, error.stack,500);
  }
};

function getForgotPasswordMessage(userId){
	return `
		You recently requested to reset your password. To reset your password, please click on the link below:
    <br>
    https://demo.scriptindia.in:8006/new-password/${userId}
    <br><br>
    If you did not request this change, you can safely ignore this email. Your password will remain unchanged.
	`
}