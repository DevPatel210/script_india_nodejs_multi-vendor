const bcrypt = require("bcrypt");
const { Vendor } = require("../../../models/vendor.model");
const makeMongoDbServiceVendor = require("../../../services/mongoDbService")({
  model: Vendor,
});
const _ = require("lodash");
const { response, resMessage } = require("../../../helpers/common");

// Update vendor
exports.Update = async (req) => {
  try {
    const id = req.body.id;
    let isVendor = await makeMongoDbServiceVendor.getDocumentById(id);

    if (!isVendor) {
      return response(true, resMessage.vendorNotFound, null);
    }
    const vendorData = req.body; // update vendor payload
    if(req.isVendor==true && vendorData.commission){
      delete vendorData.commission;
    }
    const updatedVendor = await makeMongoDbServiceVendor.findOneAndUpdateDocument(
      { _id: id },
      vendorData
    );

    return response(false, resMessage.vendorUpdated, null, updatedVendor);
  } catch (error) {
    console.log(error);
    return response(true, null, error.message, error.stack);
  }
};
