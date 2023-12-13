const { resMessage, response } = require("../helpers/common");

exports.isAdminAuth = async (req, res, next) => {
  try {
    if (!req.user.isAdmin) {
      return res
      .status(200)
      .json(response(true, null, resMessage.unAuthorized));;
    }
    next();
  } catch (err) {
    res.status(400).json(err);
  }
};
