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
      const matchCondition = { 
        $and: [
          {status: { $ne: 'D' }} 
        ]
      };

      let sortCriteria = { _id: -1 };
      if(req.query && req.query.sort) {
        if (req.query.sort=='atoz') {
          sortCriteria = { first_name: 1, last_name: 1 };
        } else if (req.query.sort=='ztoa') {
          sortCriteria = { first_name: -1, last_name: -1 };
        }
      }

      if (searchValue && searchValue.trim() !== "") {
        matchCondition['$and'].push({
          $or: [
            { first_name: { $regex: searchValue, $options: "i" } },
            { last_name: { $regex: searchValue, $options: "i" } },
            { email: { $regex: searchValue, $options: "i" } },
            { password: { $regex: searchValue, $options: "i" } },
            { address: { $regex: searchValue, $options: "i" } },
            { address2: { $regex: searchValue, $options: "i" } },
            { city: { $regex: searchValue, $options: "i" } },
            { country: { $regex: searchValue, $options: "i" } },
            { state: { $regex: searchValue, $options: "i" } },
            { pincode: { $regex: searchValue, $options: "i" } },
            // { phone_number: { $regex: searchValue, $options: "i" } },
          ],
        });
      }

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
            country: 1,
            state: 1,
            address: 1,
            address2: 1,
            status: 1,
            phone_number: 1,
          },
        },
        { $sort: sortCriteria }, // Add the $sort stage to sort the documents
        { $skip: skip },
        { $limit: pageSize },
      ]);

      let userCount = await makeMongoDbService.getCountDocumentByQuery(matchCondition);

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
      },200);
    }
    return response(true, null, resMessage.failed,[],400);
  } catch (error) {
    console.log(error)
    return response(true, null, error.message, error.stack,500);
  }
};

exports.findById = async (req) => {
  try {
    const id = (req.user && req.user.isAdmin) ? req.query.id : req.user._id;
    let isuser = await makeMongoDbService.getSingleDocumentById(id)
    
    if (!isuser || isuser.status == "D") {
      return response(true, null, resMessage.failed,[],404);
    }

    return response(false, null, resMessage.success, isuser,200);
  } catch (error) {
    return response(true, null, error.message, error.stack,500);
  }
};
