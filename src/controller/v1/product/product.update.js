const { Product } = require("../../../models/product.model");
const makeMongoDbService = require("../../../services/mongoDbService")({
  model: Product,
});
const { response, resMessage } = require("../../../helpers/common");

// Update Product
exports.Update = async (req) => {
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

    if (!isProduct) {
      return response(true, resMessage.notFound, null);
    }
    const productData = req.body; // update product payload
    const updatedProduct = await makeMongoDbService.findOneAndUpdateDocument(
      { _id: req.body.product_id },
      productData
    );

    return response(false, resMessage.success, null, updatedProduct);
  } catch (error) {
    console.log(error);
    return response(true, null, error.message, error.stack);
  }
};
