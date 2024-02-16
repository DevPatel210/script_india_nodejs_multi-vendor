const { Category } = require("../../../models/category.model");
const makeMongoDbService = require("../../../services/mongoDbService")({
  model: Category,
});
const { response, resMessage } = require("../../../helpers/common");

// Create and Save a new category
exports.create = async (req) => {
  try {
    if(!req.isAdmin){
      return response(true, null, resMessage.failed,[],403);
    }

    const newCategory = await makeMongoDbService.createDocument(req.body);

    return response(
      false,
      resMessage.success,
      null,
      newCategory,
      201
    );
  } catch (error) {
    throw response(true, null, error.message, error.stack,500);
  }
};
