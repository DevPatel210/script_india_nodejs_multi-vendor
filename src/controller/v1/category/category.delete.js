const { Category } = require("../../../models/category.model");
const makeMongoDbService = require("../../../services/mongoDbService")({
  model: Category,
});
const { response, resMessage } = require("../../../helpers/common");

// Delete Category
exports.delete = async (req) => {
  try {
    let isCategory;
    if(!req.isAdmin){
      return response(true, null, resMessage.failed,[],403);
    }
    
    isCategory = await makeMongoDbService.getSingleDocumentById(
      req.body.category_id
    );

    if (!isCategory || isCategory.status == "D") {
      return response(true, resMessage.notFound, null,[],404);
    }
    const deletedCategory = await makeMongoDbService.softDeleteDocument({
      _id: req.body.category_id,
    });

    return response(false, resMessage.success, null, deletedCategory,200);
  } catch (error) {
    return response(true, null, error.message, error.stack,500);
  }
};
