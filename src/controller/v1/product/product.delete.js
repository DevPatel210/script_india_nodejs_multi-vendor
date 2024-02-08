const { Product } = require("../../../models/product.model");
const makeMongoDbService = require("../../../services/mongoDbService")({
  model: Product,
});
const { response, resMessage } = require("../../../helpers/common");

// Delete Product
exports.delete = async (req) => {
  try {
    let isProduct;
    if(req.isVendor){
      isProduct = await makeMongoDbService.getSingleDocumentByQuery({ 
				vendor: req.vendor._id, _id: req.body.product_id
			});
    }else{
      isProduct = await makeMongoDbService.getSingleDocumentById(
        req.body.product_id
      );
    }

    if (!isProduct || isProduct.status == "D") {
      return response(true, resMessage.notFound, null,[],404);
    }
    const deletedProduct = await makeMongoDbService.softDeleteDocument({
      _id: req.body.product_id,
    });

    return response(false, resMessage.success, null, deletedProduct,200);
  } catch (error) {
    return response(true, null, error.message, error.stack,500);
  }
};
