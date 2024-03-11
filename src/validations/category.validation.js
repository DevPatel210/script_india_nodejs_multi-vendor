const { body, check, query } = require("express-validator");

const customValidator = (value) => {
  if (typeof value === 'string' || Array.isArray(value)) {
    return true;
  }
  return false;
};

module.exports = {
            
  addCategory: [
    body("name", "name can not be empty").notEmpty().isString(),
    body("image", "image can not be empty").notEmpty().isArray(),
  ],

  updateCategory: [
    body("category_id", "category_id can not be empty").notEmpty().isString(),
    body("name", "name can not be empty").optional().notEmpty().isString(),
    body("image", "image can not be empty").optional().notEmpty().custom(customValidator),
    body("status", "status can not be empty").optional().notEmpty().isString(),
  ],

  getCategory: [
    query('category_id', "category_id can not be empty").notEmpty().isString(),
  ],

  listCategory: [
    query("pageNumber", "pageNumber parameter should be number").default(1).toInt(),
  ],
  
  deleteCategory: [
    body('product_id', "product_id can not be empty").notEmpty().isString()
  ]
}