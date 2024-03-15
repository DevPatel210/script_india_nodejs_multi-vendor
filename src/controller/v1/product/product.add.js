const { Product } = require("../../../models/product.model");
const makeMongoDbService = require("../../../services/mongoDbService")({
  model: Product,
});
const { response, resMessage } = require("../../../helpers/common");
const { sendEmail } = require("../../../services/email");

// Create and Save a new product
exports.create = async (req) => {
  try {
    if(!req.body.vendor){
      req.body.vendor = req.vendor._id;
    }
    const newProduct = await makeMongoDbService.createDocument(req.body);

    const vendorDetails = await makeMongoDbServiceVendor.getSingleDocumentById(isProduct.vendor);
    const message = getPendingApprovalMessage(newProduct, vendorDetails);
    await sendEmail('','New/Update Product Approval Pending', message);

    return response(
      false,
      resMessage.success,
      null,
      newProduct,
      201
    );
  } catch (error) {
    console.log(error);
    throw response(true, null, error.message, error.stack,500);
  }
};

function getPendingApprovalMessage(product, vendor){
	return `
		A new product has been added by a vendor and is currently pending your approval.
    <br><br>
    Product Details:
    - Product Title: ${product.title}
    - Vendor Name: ${vendor.first_name} ${vendor.last_name}
    - Description: ${product.description}
    - Price: ${product.price}
    <br><br>
    Please review the product and take necessary action.
	`
}