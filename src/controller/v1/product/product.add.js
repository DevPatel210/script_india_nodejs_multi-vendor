const { Product } = require("../../../models/product.model");
const makeMongoDbService = require("../../../services/mongoDbService")({
  model: Product,
});
const { response, resMessage } = require("../../../helpers/common");

// Create and Save a new Movie
exports.create = async (req) => {
  try {
    const newProduct = await makeMongoDbService.createDocument(req.body);

    return response(
      false,
      resMessage.success,
      null,
      newProduct
    );
  } catch (error) {
    throw response(true, null, error.message, error.stack);
  }
};
