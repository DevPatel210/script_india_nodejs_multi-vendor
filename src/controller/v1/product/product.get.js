const { response, resMessage } = require("../../../helpers/common");
const { Product } = require("../../../models/product.model");
const { Order } = require("../../../models/order.model");
const { Vendor } = require("../../../models/vendor.model");
const { Category } = require("../../../models/category.model");
const Review = require("../../../models/review.model");
const makeMongoDbService = require("../../../services/mongoDbService")({
  model: Product,
});
const makeMongoDbServiceVendor = require("../../../services/mongoDbService")({
  model: Vendor,
});
const makeMongoDbServiceOrder = require("../../../services/mongoDbService")({
  model: Order,
});
const makeMongoDbServiceReview = require("../../../services/mongoDbService")({
  model: Review,
});

const makeMongoDbServiceCategory = require("../../../services/mongoDbService")({
  model: Category,
});

// Retrieve and return all products from the database.
exports.findAll = async (req) => {
  try {
    let meta = {};
    const pageNumber = parseInt(req.query.pageNumber);
    if (isNaN(pageNumber) || pageNumber < 1) {
      throw new Error("Invalid pageNumber");
    }
    const pageSize = 10;
    const skip = pageNumber === 1 ? 0 : parseInt((pageNumber - 1) * pageSize);
    let sortCriteria = { _id: -1 };
    if (req.query && req.query.sort) {
      if (req.query.sort == "atoz") {
        sortCriteria = { title: 1 };
      } else if (req.query.sort == "ztoa") {
        sortCriteria = { title: -1 };
      } else if (req.query.sort == "priceLow") {
        sortCriteria = { price: 1 };
      } else if ((req.query.sort = "priceHigh")) {
        sortCriteria = { price: -1 };
      }
    }
    const searchValue = req.query.search;
    let vendors = await makeMongoDbServiceVendor.getDocumentByQuery({
      status: { $ne: "D" },
    });
    vendors = vendors.reduce((obj, item) => ((obj[item._id] = item), obj), {});

    let matchCondition = {};
    if (searchValue && searchValue.trim() !== "") {
      matchCondition.$and = [
        {
          $or: [
            { title: { $regex: searchValue, $options: "i" } },
            { sub_title: { $regex: searchValue, $options: "i" } },
            { author: { $regex: searchValue, $options: "i" } },
            { description: { $regex: searchValue, $options: "i" } },
            { category: { $regex: searchValue, $options: "i" } },
          ],
        },
      ];
    }
    //filter base on Origins
    if (req.query.origins) {
      if (!matchCondition.$and) {
        matchCondition.$and = [
          {
            origins: req.query.origins,
          },
        ];
      } else {
        matchCondition.$and.push({
          origins: req.query.origins,
        });
      }
    }

    //filter base on missions
    if (req.query.missions) {
      if (!matchCondition.$and) {
        matchCondition.$and = [
          {
            missions: req.query.missions,
          },
        ];
      } else {
        matchCondition.$and.push({
          missions: req.query.missions,
        });
      }
    }

    //filter base on roast
    if (req.query.roast) {
      if (!matchCondition.$and) {
        matchCondition.$and = [
          {
            roast: req.query.roast,
          },
        ];
      } else {
        matchCondition.$and.push({
          roast: req.query.roast,
        });
      }
    }

    if (req.query.filterBy == "A" || req.query.filterBy == "P") {
      if (!matchCondition.$and) {
        matchCondition.$and = [
          {
            status: req.query.filterBy,
          },
        ];
      } else {
        matchCondition.$and.push({
          status: req.query.filterBy,
        });
      }
    }

    let productsList, productCount;
    if (req.isVendor) {
      if (!matchCondition.$and) {
        matchCondition = { vendor: req.vendor._id, status: { $ne: "D" } };
      } else {
        matchCondition.$and.push({
          vendor: req.vendor._id,
          status: { $ne: "D" },
        });
      }
      productsList = await makeMongoDbService.getDocumentByCustomAggregation([
        { $match: matchCondition },
        {
          $project: {
            title: 1,
            subTitle: 1,
            author: 1,
            description: 1,
            price: 1,
            offer_price: 1,
            image: 1,
            category: 1,
            status: 1,
            isSoldOut: 1,
            weight: 1,
            origins: 1,
            missions: 1,
            roast: 1,
            bean: 1,
            vendor: 1,
            markup_price: 1,
            total_price: 1,
            markup_type: 1,
            extraAttr: 1,
            createdAt: 1,
            updatedAt: 1,
            oldDetails: 1,
          },
        },
        { $sort: sortCriteria },
        // { $skip: skip },
        // { $limit: pageSize },
      ]);
      productCount = await makeMongoDbService.getCountDocumentByQuery(
        matchCondition
      );
    } else {
      if (!matchCondition.$and) {
        matchCondition = { status: { $ne: "D" } };
      } else {
        matchCondition.$and.push({ status: { $ne: "D" } });
      }
      productsList = await makeMongoDbService.getDocumentByCustomAggregation([
        { $match: matchCondition },
        {
          $project: {
            title: 1,
            subTitle: 1,
            author: 1,
            description: 1,
            price: 1,
            offer_price: 1,
            image: 1,
            category: 1,
            status: 1,
            vendor: 1,
            isSoldOut: 1,
            weight: 1,
            origins: 1,
            missions: 1,
            roast: 1,
            bean: 1,
            markup_price: 1,
            markup_type: 1,
            total_price: 1,
            extraAttr: 1,
            createdAt: 1,
            updatedAt: 1,
            oldDetails: 1,
          },
        },
        { $sort: sortCriteria },
        // { $skip: skip },
        // { $limit: pageSize },
      ]);
      productCount = await makeMongoDbService.getCountDocumentByQuery(
        matchCondition
      );
    }

    let reviewedProducts = [];
    if (req.query && req.query.userId) {
      const productsSet = new Set();
      let matchConditionOrder = {
        $and: [{ status: { $ne: "D" } }, { user_id: req.query.userId }],
      };

      const orders = await makeMongoDbServiceOrder.getDocumentByQuery(
        matchConditionOrder
      );

      for (let order of orders) {
        for (let product of order.accounting.cartAccountingList) {
          productsSet.add(product.productId.toString());
        }
      }

      reviewedProducts = Array.from(productsSet);
    }
    productsList = productsList.filter(
      (product) => !(product.status == "P" && product.oldDetails == null)
    );

    productsList = await Promise.all(
      productsList.map(async (product) => {
        let vendor = vendors[product.vendor];
        if (!vendor || vendor.status == "D") {
          vendor = { commission: 0 };
        }
        let reviews = await makeMongoDbServiceReview.getDocumentByQueryPopulate(
          {
            product: product._id.toString(),
            status: { $ne: "D" },
          },
          null,
          ["user"]
        );

        let category = await makeMongoDbServiceCategory.getDocumentById(
          product.category
        );

        let productData = product;
        if (product.status == "P") {
          productData = product.oldDetails;
        }
        return {
          ...productData,
          // category,
          canAddReview: reviewedProducts.includes(product._id.toString()),
          reviews,
          vendorDetails:
            !vendor || vendor.status == "D"
              ? {}
              : {
                  email: vendor.email,
                  first_name: vendor.first_name,
                  last_name: vendor.last_name,
                  commission: vendor.commission,
                  display: vendor.display,
                },
          //commission: (product.price * vendor.commission) / 100,
          //finalPrice: product.price + (product.price * vendor.commission) / 100,
          finalPrice: product.total_price ? product.total_price.toFixed(2) : 0, // Set finalPrice equal to total_price with 2 decimal places
        };
      })
    );

    let displayTrueProducts = productsList.filter(
      (product) => product.vendorDetails.display
    );
    let displayFalseProducts = productsList.filter(
      (product) => !product.vendorDetails.display
    );

    productsList = [...displayTrueProducts, ...displayFalseProducts];

    productsList = productsList.slice(
      (pageNumber - 1) * pageSize,
      pageNumber * pageSize
    );

    meta = {
      pageNumber,
      pageSize,
      totalCount: productCount,
      prevPage: parseInt(pageNumber) === 1 ? false : true,
      nextPage:
        parseInt(productCount) / parseInt(pageSize) <= parseInt(pageNumber)
          ? false
          : true,
      totalPages: Math.ceil(parseInt(productCount) / parseInt(pageSize)),
    };
    return response(
      false,
      null,
      resMessage.success,
      {
        result: productsList,
        meta,
      },
      200
    );
  } catch (error) {
    return response(true, null, error.message, error.stack, 500);
  }
};

exports.findById = async (req) => {
  try {
    let isProduct;
    if (req.isVendor) {
      isProduct = await makeMongoDbService.getSingleDocumentByQuery({
        vendor: req.vendor._id,
        _id: req.query.product_id,
      });
    } else {
      isProduct = await makeMongoDbService.getSingleDocumentById(
        req.query.product_id
      );
    }
    if (!isProduct || isProduct.status == "D") {
      return response(true, null, resMessage.notFound, [], 404);
    }
    const vendor = await makeMongoDbServiceVendor.getDocumentById(
      isProduct.vendor
    );
    if (!vendor || vendor.status == "D") {
      return response(true, null, resMessage.vendorNotFound, [], 404);
    }

    let reviewedProducts = [];
    if (req.query && req.query.userId) {
      const productsSet = new Set();
      let matchConditionOrder = {
        $and: [{ status: { $ne: "D" } }, { user_id: req.query.userId }],
      };

      const orders = await makeMongoDbServiceOrder.getDocumentByQuery(
        matchConditionOrder
      );

      for (let order of orders) {
        for (let product of order.accounting.cartAccountingList) {
          productsSet.add(product.productId.toString());
        }
      }

      reviewedProducts = Array.from(productsSet);
    }

    let category = await makeMongoDbServiceCategory.getDocumentById(
      isProduct.category
    );

    let reviews = await makeMongoDbServiceReview.getDocumentByQueryPopulate(
      {
        product: isProduct._id.toString(),
        status: { $ne: "D" },
      },
      null,
      ["user"]
    );

    let productData = isProduct._doc;
    if (isProduct._doc.status == "P") {
      productData = isProduct._doc.oldDetails;
    }

    isProduct = {
      ...productData,
      reviews,
      // category: category ? category : isProduct.category,
      canAddReview: reviewedProducts.includes(isProduct._id.toString()),
      vendorDetails: {
        email: vendor.email,
        first_name: vendor.first_name,
        last_name: vendor.last_name,
        commission: vendor.commission,
        total_price: isProduct.total_price,
      },
      //commission: (isProduct.price * vendor.commission) / 100,
      //finalPrice: isProduct.price + (isProduct.price * vendor.commission) / 100,
      finalPrice: isProduct.total_price ? isProduct.total_price.toFixed(2) : 0,
    };
    return response(false, null, resMessage.success, isProduct, 200);
  } catch (error) {
    return response(true, null, error.message, error.stack, 500);
  }
};
