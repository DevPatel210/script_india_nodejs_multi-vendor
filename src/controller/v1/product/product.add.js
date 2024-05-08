const { Product } = require("../../../models/product.model");
const { Vendor } = require("../../../models/vendor.model");
const makeMongoDbService = require("../../../services/mongoDbService")({
  model: Product,
});
const makeMongoDbServiceVendor = require("../../../services/mongoDbService")({
  model: Vendor,
});
const { response, resMessage } = require("../../../helpers/common");
const { sendEmail } = require("../../../services/email");

// Create and Save a new product
exports.create = async (req) => {
  try {
    if (!req.body.vendor) {
      req.body.vendor = req.vendor._id;
    }

    console.log("Before split:", req.body.bean);
    if (req.body.bean && typeof req.body.bean === "string") {
      req.body.bean = req.body.bean.split(",");
    }
    console.log('After split:', req.body.bean);
    req.body.total_price = req.body.price;
    let newProduct = await makeMongoDbService.createDocument(req.body);
    // newProduct.oldDetails = {...newProduct._doc};
    // const updatedProduct = await makeMongoDbService.findOneAndUpdateDocument(
    //   { _id: newProduct._id },
    //   newProduct
    // );
    const vendorDetails = await makeMongoDbServiceVendor.getSingleDocumentById(req.body.vendor);
    const message = getPendingApprovalMessage(newProduct, vendorDetails);
    await sendEmail("", "New Product Approval Pending", message);

    return response(
      false,
      resMessage.success,
      null,
      // updatedProduct,
      newProduct,
      201
    );
  } catch (error) {
    console.log(error);
    throw response(true, null, error.message, error.stack, 500);
  }
};

function getPendingApprovalMessage(product, vendor) {
  return `
		A new product has been added by a vendor and is currently pending your approval.
    <br><br>
    Product Details: <br>
    - Product Title: ${product.title} <br>
    - Vendor Name: ${vendor.first_name} ${vendor.last_name} <br>
    - Description: ${product.description} <br>
    - Price: $ ${product.price} <br>
    <br><br>
    Please review the product and take necessary action.
	`;
}
