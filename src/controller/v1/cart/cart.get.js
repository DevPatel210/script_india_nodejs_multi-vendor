const { Cart } = require("../../../models/cart.model");
const { Vendor } = require("../../../models/vendor.model");
const { Category } = require("../../../models/category.model"); // Import the Category model
const makeMongoDbService = require("../../../services/mongoDbService")({
  model: Cart,
});
const makeMongoDbServiceVendor = require("../../../services/mongoDbService")({
  model: Vendor,
});
const { response, resMessage } = require("../../../helpers/common");

exports.get = async (req) => {
  try {
    const { _id } = req.user;
    let vendors = await makeMongoDbServiceVendor.getDocumentByQuery({
      status: { $ne: "D" },
    });
    vendors = vendors.reduce((obj, item) => ((obj[item._id] = item), obj), {});

    let result = await makeMongoDbService.getSingleDocumentByQueryPopulate(
      { user: _id },
      null,
      ["cartItems.product"]
    );

    let cartItems = [];
    for (let product of result.cartItems) {
      quantity = product._doc.quantity;
      bean = product._doc.bean;
      product = product._doc.product;
      let vendor = vendors[product.vendor];
      if (!vendor || vendor.status == "D") {
        vendor = { commission: 0 };
      }

      // Fetch category details
      const category = await Category.findById(product.category);
      const categoryName = category ? category.name : "Unknown"; // Use "Unknown" if category is not found

      cartItems.push({
        ...product._doc,
        bean,
        quantity,
        //commission: (product.price * quantity * vendor.commission) / 100,
        // finalPrice:
        //   (product.price + (product.price * vendor.commission) / 100) *
        //   quantity,
        finalPrice: product.total_price * quantity, // Set finalPrice equal to total_price
        bean,
        vendor: !vendor || vendor.status == "D" ? {} : vendor,
        category: categoryName, // Include category name in the cart item
      });
    }

    finalResult = {
      id: result.id,
      user: result.user,
      cartItems: cartItems,
    };
    return response(false, resMessage.success, null, finalResult, 200);
  } catch (error) {
    throw response(true, null, error.message, error.stack, 500);
  }
};
