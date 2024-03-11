const { Category } = require("../../../models/category.model");
const makeMongoDbService = require("../../../services/mongoDbService")({
  model: Category,
});
const { response, resMessage } = require("../../../helpers/common");

// Update Category
exports.Update = async (req) => {
  try {
    let isCategory;
    if(!req.isAdmin){
      return response(true, null, resMessage.failed,[],403);
    }
    
    isCategory = await makeMongoDbService.getSingleDocumentById(
      req.body.category_id
    );

    if (!isCategory) {
      return response(true, resMessage.notFound, null,[],404);
    }
    const categoryData = req.body; // update category payload
    if(typeof categoryData.image == 'string'){
      delete categoryData.image;
    }
    const updatedCategory = await makeMongoDbService.findOneAndUpdateDocument(
      { _id: req.body.category_id },
      categoryData
    );

    return response(false, resMessage.success, null, updatedCategory,200);
  } catch (error) {
    return response(true, null, error.message, error.stack,500);
  }
};
