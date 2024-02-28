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
      return response(true, resMessage.notFound, null,[],404);
    }
    const productData = req.body; // update product payload
    const updatedProduct = await makeMongoDbService.findOneAndUpdateDocument(
      { _id: req.body.product_id },
      productData
    );

    return response(false, resMessage.success, null, updatedProduct,200);
  } catch (error) {
    return response(true, null, error.message, error.stack,500);
  }
};

exports.approveProduct = async (req) => {
  try {
    if(!req.isAdmin){
      return response(true, null, resMessage.failed,[],403);
    }
    let isProduct = await makeMongoDbService.getSingleDocumentById(
      req.body.product_id
    );

    if (!isProduct || isProduct.status=='D') {
      return response(true, resMessage.notFound, null,[],404);
    }
    
    if (isProduct.status=='A') {
      return response(true, 'Product already approved', null,[],400);
    }

    isProduct.status='A';
    const updatedProduct = await makeMongoDbService.findOneAndUpdateDocument(
      { _id: req.body.product_id },
      isProduct
    );

    return response(false, resMessage.success, null, updatedProduct,200);
  } catch (error) {
    return response(true, null, error.message, error.stack,500);
  }
}

exports.unApproveProduct = async (req) => {
  try {
    if(!req.isAdmin){
      return response(true, null, resMessage.failed,[],403);
    }
    let isProduct = await makeMongoDbService.getSingleDocumentById(
      req.body.product_id
    );

    if (!isProduct || isProduct.status=='D') {
      return response(true, resMessage.notFound, null,[],404);
    }
    
    if (isProduct.status=='P') {
      return response(true, 'Product already in pending state', null,[],400);
    }

    isProduct.status='P';
    const updatedProduct = await makeMongoDbService.findOneAndUpdateDocument(
      { _id: req.body.product_id },
      isProduct
    );

    return response(false, resMessage.success, null, updatedProduct,200);
  } catch (error) {
    return response(true, null, error.message, error.stack,500);
  }
}