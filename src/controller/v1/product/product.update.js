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

// Update Product
exports.Update = async (req) => {
  try {
    let isProduct;
    if (req.isVendor) {
      isProduct = await makeMongoDbService.getSingleDocumentByQuery({
        vendor: req.vendor._id,
        _id: req.body.product_id,
      });
      req.body.status = "P";
    } else {
      isProduct = await makeMongoDbService.getSingleDocumentById(
        req.body.product_id
      );
    }

    if (!isProduct) {
      return response(true, resMessage.notFound, null, [], 404);
    }
    const productData = req.body; // update product payload

    if (typeof productData.bean === "string") {
      productData.bean = productData.bean.split(",");
    }

    if (typeof productData.image == "string") {
      delete productData.image;
    }
    const updatedProduct = await makeMongoDbService.findOneAndUpdateDocument(
      { _id: req.body.product_id },
      productData
    );

    if (req.isVendor) {
      const productDetails = await makeMongoDbService.getSingleDocumentById(
        req.body.product_id
      );
      const vendorDetails =
        await makeMongoDbServiceVendor.getSingleDocumentById(isProduct.vendor);
      const message = getPendingApprovalMessage(productDetails, vendorDetails);
      await sendEmail("", "Update Product Approval Pending", message);
    }

    return response(false, resMessage.success, null, updatedProduct, 200);
  } catch (error) {
    return response(true, null, error.message, error.stack, 500);
  }
};

exports.approveProduct = async (req) => {
  try {
    if (!req.isAdmin) {
      return response(true, null, resMessage.failed, [], 403);
    }
    let isProduct = await makeMongoDbService.getSingleDocumentById(
      req.body.product_id
    );

    if (!isProduct || isProduct.status == "D") {
      return response(true, resMessage.notFound, null, [], 404);
    }

    if (isProduct.status == "A") {
      return response(true, "Product already approved", null, [], 400);
    }

    isProduct.status = "A";
    // Check if markup_price is provided in the request
    if (req.body.markup_price !== undefined) {
      // If provided, add the markup_price field to the product object
      isProduct.markup_price = req.body.markup_price;
    }

    // Check if total_price is provided in the request
    if (req.body.total_price !== undefined) {
      // If provided, add the total_price field to the product object
      isProduct.total_price = req.body.total_price;
    }

    const updatedProduct = await makeMongoDbService.findOneAndUpdateDocument(
      { _id: req.body.product_id },
      isProduct
    );

    const vendorDetails = await makeMongoDbServiceVendor.getSingleDocumentById(
      isProduct.vendor
    );
    const message = getApprovedMessage(isProduct);
    await sendEmail(
      vendorDetails.email,
      "Product Approval Notification",
      message,
      true
    );

    return response(false, resMessage.success, null, updatedProduct, 200);
  } catch (error) {
    console.log(error);
    return response(true, null, error.message, error.stack, 500);
  }
};

exports.unApproveProduct = async (req) => {
  try {
    if (!req.isAdmin) {
      return response(true, null, resMessage.failed, [], 403);
    }
    let isProduct = await makeMongoDbService.getSingleDocumentById(
      req.body.product_id
    );

    if (!isProduct || isProduct.status == "D") {
      return response(true, resMessage.notFound, null, [], 404);
    }

    if (isProduct.status == "P") {
      return response(true, "Product already in pending state", null, [], 400);
    }

    isProduct.status = "P";
    const updatedProduct = await makeMongoDbService.findOneAndUpdateDocument(
      { _id: req.body.product_id },
      isProduct
    );

    return response(false, resMessage.success, null, updatedProduct, 200);
  } catch (error) {
    return response(true, null, error.message, error.stack, 500);
  }
};

function getPendingApprovalMessage(product, vendor) {
  return `
		A product has been updated by a vendor and is currently pending your approval.
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

function getApprovedMessage(product) {
  return `
		We are pleased to inform you that your product has been approved by the admin and is now live on our platform.
    <br><br>
    Product Details: <br>
    - Product Name: ${product.title} <br>
    - Description: ${product.description} <br>
    - Price: $ ${product.price} <br>
	`;
}
