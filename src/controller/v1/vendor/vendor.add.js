const { Vendor } = require("../../../models/vendor.model");
const makeMongoDbServiceVendor = require("../../../services/mongoDbService")({
  model: Vendor,
});
const _ = require("lodash");
const { hashPassword } = require("../../../services/bcryptService");
const { response, resMessage } = require("../../../helpers/common");

// Create and Save a new Vendor
exports.create = async (req) => {
  try {
    const { email } = req.body;
    // Make sure this account doesn't already exist
    const vendor = await makeMongoDbServiceVendor.getSingleDocumentByQuery(
      {
        email,
      },
      []
    );
    if (vendor) {
      return response(true, resMessage.alreadyExist, "null", [], 400);
    }
    req.body.password = await hashPassword(req.body.password);
    const vendorData = req.body;
    const newVendor = await makeMongoDbServiceVendor.createDocument(vendorData);

    return response(
      false,
      resMessage.success,
      null,
      _.pick(newVendor, [
        "_id",
        "first_name",
        "last_name",
        "email",
        "phone_number",
        "address",
        "taxId",
        "image",
        "display",
        "website",
      ]),
      201
    );
  } catch (error) {
    return response(true, null, error.message, error.stack, 500);
  }
};
