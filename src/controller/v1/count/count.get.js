const { response, resMessage } = require("../../../helpers/common");
const { User } = require("../../../models/user.model");
const { Vendor } = require("../../../models/vendor.model");
const { Order } = require("../../../models/order.model");
const { Product } = require("../../../models/product.model");
const makeMongoDbService = require("../../../services/mongoDbService")
const makeMongoDbServiceUser = makeMongoDbService({model: User});
const makeMongoDbServiceVendor = makeMongoDbService({model: Vendor});
const makeMongoDbServiceOrder = makeMongoDbService({model: Order});
const makeMongoDbServiceProduct = makeMongoDbService({model: Product});

// return all users count.
exports.user = async (req) => {
  try {
    // if (req.user && req.user.isAdmin) {
      let userCount = await makeMongoDbServiceUser.getCountDocumentByQuery({status: { $ne: 'D'}});
      return response(false, null, resMessage.success, {
        count: userCount
      });
    // }
    // return response(true, null, resMessage.failed);
  } catch (error) {
    return response(true, null, error.message, error.stack);
  }
};

// return all vendors count.
exports.vendor = async (req) => {
  try {
    // if (req.user && req.user.isAdmin) {
      let vendorCount = await makeMongoDbServiceVendor.getCountDocumentByQuery({status: { $ne: 'D'}});
      return response(false, null, resMessage.success, {
        count: vendorCount
      });
    // }
    // return response(true, null, resMessage.failed);
  } catch (error) {
    return response(true, null, error.message, error.stack);
  }
};

// return all orders count.
exports.order = async (req) => {
  try {
    // if (req.user && req.user.isAdmin) {
      let orderCount = await makeMongoDbServiceOrder.getCountDocumentByQuery({status: { $ne: 'D'}});
      return response(false, null, resMessage.success, {
        count: orderCount
      });
    // }
    // return response(true, null, resMessage.failed);
  } catch (error) {
    return response(true, null, error.message, error.stack);
  }
};

// return all products count.
exports.product = async (req) => {
  try {
    // if (req.user && req.user.isAdmin) {
      let productCount = await makeMongoDbServiceProduct.getCountDocumentByQuery({status: { $ne: 'D'}});
      return response(false, null, resMessage.success, {
        count: productCount
      });
    // }
    // return response(true, null, resMessage.failed);
  } catch (error) {
    return response(true, null, error.message, error.stack);
  }
};
