const { response, resMessage } = require("../../../helpers/common");
const { User } = require("../../../models/user.model");
const makeMongoDbService = require("../../../services/mongoDbService")({
  model: User,
});

// Retrieve and return all users from the database.
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
      const matchCondition = { };

      if (searchValue && searchValue.trim() !== "") {
        matchCondition.$and = [
          {
            $or: [
              { first_name: { $regex: searchValue, $options: "i" } },
              { last_name: { $regex: searchValue, $options: "i" } },
              { email: { $regex: searchValue, $options: "i" } },
              { password: { $regex: searchValue, $options: "i" } },
              { address: { $regex: searchValue, $options: "i" } },
              { city: { $regex: searchValue, $options: "i" } },
              { pincode: { $regex: searchValue, $options: "i" } },
              { phone_number: { $regex: searchValue, $options: "i" } },
            ],
          },
        ];
      }
      const sortCriteria = { _id: -1 }; // Sort by the '_id' field in descending order (newest first)

      const userList = await makeMongoDbService.getDocumentByCustomAggregation([
        {
          $match: matchCondition,
        },
        {
          $project: {
            first_name: 1,
            last_name: 1,
            email: 1,
            pincode: 1,
            city: 1,
            address: 1,
            status: 1,
            phone_number: 1,
          },
        },
        { $sort: sortCriteria }, // Add the $sort stage to sort the documents
        { $skip: skip },
        { $limit: pageSize },
      ]);

      let userCount = await makeMongoDbService.getCountDocumentByQuery({});

      meta = {
        pageNumber,
        pageSize,
        totalCount: userCount,
        prevPage: parseInt(pageNumber) === 1 ? false : true,
        nextPage:
          parseInt(userCount) / parseInt(pageSize) <= parseInt(pageNumber)
            ? false
            : true,
        totalPages: Math.ceil(parseInt(userCount) / parseInt(pageSize)),
      };

      return response(false, null, resMessage.success, {
        result: userList,
        meta,
      });
    }
    return response(true, null, resMessage.failed);
  } catch (error) {
    return response(true, null, error.message, error.stack);
  }
};

exports.findById = async (req) => {
  try {
    const id = (req.user && req.user.isAdmin) ? req.query.id : req.user._id;
    let isuser = await makeMongoDbService.getSingleDocumentById(id)
    
    if (!isuser) {
      return response(true, null, resMessage.failed);
    }

    return response(false, null, resMessage.success, isuser);
  } catch (error) {
    return response(true, null, error.message, error.stack);
  }
};
