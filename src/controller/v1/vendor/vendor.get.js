const { response, resMessage } = require("../../../helpers/common");
const { Vendor } = require("../../../models/vendor.model");
const makeMongoDbService = require("../../../services/mongoDbService")({
  model: Vendor,
});

// Retrieve and return all vendors from the database.
exports.findAll = async (req) => {
  try {
    if (req.user && req.user.isAdmin) {
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
    return response(true, null, resMessage.failed,[],400);
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
