const { response, resMessage } = require("../../../helpers/common");
const { Vendor } = require("../../../models/vendor.model");
const { Cart } = require("../../../models/cart.model");
const makeMongoDbService = require("../../../services/mongoDbService")({
  model: Vendor,
});
const makeMongoDbServiceCart = require("../../../services/mongoDbService")({
  model: Cart,
});

// Retrieve and return all vendors from the database.
exports.findAll = async (req) => {
  try {
     {
      let meta = {};
      const pageNumber = parseInt(req.query.pageNumber);
      if (isNaN(pageNumber) || pageNumber < 1) {
        throw new Error('Invalid pageNumber');
      }
      const pageSize = 10;
      const skip = pageNumber === 1 ? 0 : parseInt((pageNumber - 1) * pageSize);
      const searchValue = req.query.search; // Replace with your actual search value
      const matchCondition = { 
        $and: [
          {status: { $ne: 'D' }} 
        ]
      };

      if (searchValue && searchValue.trim() !== "") {
        matchCondition['$and'].push({
          $or: [
            { first_name: { $regex: searchValue, $options: "i" } },
            { last_name: { $regex: searchValue, $options: "i" } },
            { email: { $regex: searchValue, $options: "i" } },
          ],
        });
      }
      const sortCriteria = { _id: -1 }; // Sort by the '_id' field in descending order (newest first)

      const vendorList = await makeMongoDbService.getDocumentByCustomAggregation([
        {
          $match: matchCondition,
        },
        {
          $project: {
            first_name: 1,
            last_name: 1,
            email: 1,
            status: 1,
            commission:1,
            phone_number:1,
            address:1,
            taxId:1,
            image:1,
          },
        },
        { $sort: sortCriteria }, // Add the $sort stage to sort the documents
        { $skip: skip },
        { $limit: pageSize },
      ]);

      let vendorCount = await makeMongoDbService.getCountDocumentByQuery(matchCondition);

      meta = {
        pageNumber,
        pageSize,
        totalCount: vendorCount,
        prevPage: parseInt(pageNumber) === 1 ? false : true,
        nextPage:
          parseInt(vendorCount) / parseInt(pageSize) <= parseInt(pageNumber)
            ? false
            : true,
        totalPages: Math.ceil(parseInt(vendorCount) / parseInt(pageSize)),
      };

      return response(false, null, resMessage.success, {
        result: vendorList,
        meta,
      },200);
    }
    
  } catch (error) {
    return response(true, null, error.message, error.stack,500);
  }
};

exports.findById = async (req) => {
  try {
    const id = req.query.id;
    let isVendor = await makeMongoDbService.getSingleDocumentById(id)
    
    if (!isVendor|| isVendor.status == "D") {
      return response(true, null, resMessage.failed,[],404);
    }

    return response(false, null, resMessage.success, isVendor,200);
  } catch (error) {
    return response(true, null, error.message, error.stack,500);
  }
};

exports.getAllCartProducts = async (req) => {
  try {
    if (req.isVendor) {
      const pageNumber = parseInt(req.query.pageNumber);
      if (isNaN(pageNumber) || pageNumber < 1) {
        throw new Error('Invalid pageNumber');
      }
      const pageSize = 10;
		  // const skip = pageNumber === 1 ? 0 : parseInt((pageNumber - 1) * pageSize);
      let result = await makeMongoDbServiceCart.getDocumentByQueryPopulate({}, null, ["cartItems.product", "user"]);
      result = result.filter((cart) => {
        const products = cart.cartItems.filter((product) => {
          // if(product.product && product.product.vendor && product.product.vendor.toString()==req.vendor._id.toString())
          //   console.log(product.product);
          return product.product && product.product.vendor && product.product.vendor.toString()==req.vendor._id.toString()
        });
        return products.length>0
      });
      result = result.filter((cart)=> cart.cartItems.length>0);
      result = result.map((cart) => {
        const products = cart.cartItems.filter((product) => product.product && product.product.vendor && product.product.vendor.toString()==req.vendor._id.toString());
        let total = 0;
        const mappedProducts = products.map((product) => {
          total += parseFloat(product.quantity*product.product.price)
          return {...product.product._doc,quantity: product.quantity}
        })
        return {
          user: cart.user,
          totalPrice: total,
          products: mappedProducts,
        }
      });
      const totalCount = result.length;
      result = result.slice((pageNumber - 1) * pageSize, pageNumber * pageSize);
      meta = {
			  pageNumber,
        pageSize,
        totalCount: totalCount,
        prevPage: parseInt(pageNumber) === 1 ? false : true,
        nextPage:
          parseInt(totalCount) / parseInt(pageSize) <= parseInt(pageNumber)
          ? false
          : true,
        totalPages: Math.ceil(parseInt(totalCount) / parseInt(pageSize)),
      };
      return response(false, null, resMessage.success, {result, meta},200);
    } else {
      return response(true, null, 'Only vendors can access this API', null, 403);
    }
  } catch (error) {
    console.log(error);
    return response(true, null, error.message, error.stack,500);
  }
};