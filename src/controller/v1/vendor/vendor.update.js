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
      return response(true, resMessage.vendorNotFound, null,[],404);
    }
    const vendorData = req.body; // update vendor payload
    if(req.isVendor==true && vendorData.commission){
      delete vendorData.commission;
    }
    if(typeof vendorData.image == 'string'){
      delete vendorData.image;
    }
    const updatedVendor = await makeMongoDbServiceVendor.findOneAndUpdateDocument(
      { _id: id },
      vendorData
    );

    return response(false, resMessage.vendorUpdated, null, updatedVendor,200);
  } catch (error) {
    return response(true, null, error.message, error.stack,500);
  }
};
