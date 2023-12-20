const bcrypt = require("bcrypt");
const { User } = require("../../../models/user.model");
const makeMongoDbServiceUser = require("../../../services/mongoDbService")({
  model: User,
});
const _ = require("lodash");
const { response, resMessage } = require("../../../helpers/common");

// Update user
exports.Update = async (req) => {
  try {
    const id = (req.user && req.user.isAdmin) ? req.body.id : req.user._id;
    let isuser = await makeMongoDbServiceUser.getDocumentById(id);

    if (!isuser) {
      return response(true, resMessage.userNotFound, null);
    }
    const userData = req.body; // update user payload
    const updatedUser = await makeMongoDbServiceUser.findOneAndUpdateDocument(
      { _id: id },
      userData
    );

    return response(false, resMessage.userUpdated, null, updatedUser);
  } catch (error) {
    console.log(error);
    return response(true, null, error.message, error.stack);
  }
};
