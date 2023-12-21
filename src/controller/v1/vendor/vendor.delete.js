const { response, resMessage } = require("../../../helpers/common");
const { Vendor } = require("../../../models/vendor.model");
const { Product } = require("../../../models/product.model");
const makeMongoDbService = require("../../../services/mongoDbService")({
  model: Vendor,
});
const makeMongoDbServiceProduct = require("../../../services/mongoDbService")({
  model: Product,
});

// Delete a Vendor with the specified id in the request
exports.deleteVendor = async (req) => {
  try {
    const id = req.body.id;
    let vendor = await makeMongoDbService.getDocumentById(id);
    
    if (!vendor) {
      return response(true, resMessage.vendorNotFound, null);
    }

    const products = await makeMongoDbServiceProduct.getDocumentByQuery({
      vendor: vendor._id
    });

    for (let product of products) {
      await makeMongoDbServiceProduct.softDeleteDocument(product._id);
    }
    vendor = await makeMongoDbService.softDeleteDocument(id);
    if (vendor) {
      return response(false, resMessage.vendorDeleted, null);
    } else {
      return response(true, resMessage.vendorNotDeleted, null);
    }
  } catch (error) {
    return response(true, null, error.message, error.stack);
  }
};
