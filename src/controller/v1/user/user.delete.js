const { response, resMessage } = require("../../../helpers/common");
const { User } = require("../../../models/user.model");
const makeMongoDbService = require("../../../services/mongoDbService")({
  model: User,
});

// Delete a User with the specified id in the request
exports.deleteUser = async (req) => {
  try {
    const id = req.user.isAdmin ? req.body.id : req.user._id;
    let user = await makeMongoDbService.getDocumentById(id);
    
    if (!user) {
      return response(true, resMessage.userNotFound, null);
    }

    user = await makeMongoDbService.softDeleteDocument(id);
    if (user) {
      return response(false, resMessage.userDeleted, null);
    } else {
      return response(true, resMessage.userNotDeleted, null);
    }
  } catch (error) {
    return response(true, null, error.message, error.stack);
  }
};
