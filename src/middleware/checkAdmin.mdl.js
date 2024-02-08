const { resMessage, response } = require("../helpers/common");

exports.isAdminAuth = async (req, res, next) => {
  try {
    if (!(req.user && req.user.isAdmin)) {
      return res
      .status(401)
      .json(response(true, null, resMessage.unAuthorized,[],401).data);
    }
    next();
  } catch (err) {
    res.status(400).json(err);
  }
};
