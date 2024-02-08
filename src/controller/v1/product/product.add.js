const { Product } = require("../../../models/product.model");
const makeMongoDbService = require("../../../services/mongoDbService")({
  model: Product,
});
const { response, resMessage } = require("../../../helpers/common");

// Create and Save a new product
exports.create = async (req) => {
  try {
    if(!req.body.vendor){
      req.body.vendor = req.vendor._id;
    }
    const newProduct = await makeMongoDbService.createDocument(req.body);

    return response(
      false,
      resMessage.success,
      null,
      newProduct,
      201
    );
  } catch (error) {
    throw response(true, null, error.message, error.stack,500);
  }
};
