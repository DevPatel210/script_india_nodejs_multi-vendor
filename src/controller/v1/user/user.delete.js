const { response, resMessage } = require("../../../helpers/common");
const { User } = require("../../../models/user.model");
const makeMongoDbService = require("../../../services/mongoDbService")({
  model: User,
});

// Delete a User with the specified id in the request
exports.deleteUser = async (req) => {
  try {
    const id = (req.user && req.user.isAdmin) ? req.body.id : req.user._id;
    let user = await makeMongoDbService.getDocumentById(id);
    
    if (!user) {
      return response(true, resMessage.userNotFound, null,[],404);
    }

    user = await makeMongoDbService.softDeleteDocument(id);
    if (user) {
      return response(false, resMessage.userDeleted, null,[],200);
    } else {
      return response(true, resMessage.userNotDeleted, null,[],400);
    }
  } catch (error) {
    return response(true, null, error.message, error.stack,500);
  }
};
