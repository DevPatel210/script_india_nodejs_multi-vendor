const { body, check, query } = require("express-validator");

module.exports = {
            
  addProduct: [
    body("title", "title can not be empty").notEmpty().isString(),
    body("subTitle", "subTitle can not be empty").notEmpty().isString(),
    body("author", "author can not be empty").notEmpty().isString(),
    body("description", "description can not be empty").notEmpty().isString(),
    body("price", "price can not be empty").notEmpty().isNumeric(),
    body("image", "image can not be empty").notEmpty().isArray(),
    body("category", "category can not be empty").notEmpty().isString(),
    body("isSoldOut", "isSoldOut can not be empty").optional().default(false).isBoolean(),
    // body("extraAttr", "extraAttr can not be empty").optional().notEmpty().isArray(),
    check('extraAttr.*.title').if(check('extraAttr').exists()).notEmpty().withMessage('Title is required in extraAttr'),
    check('extraAttr.*.value').if(check('extraAttr').exists()).notEmpty().withMessage('Value is required in extraAttr'),
  ],

  updateProduct: [
    body("product_id", "product_id can not be empty").notEmpty().isString(),
    body("title", "title can not be empty").optional().notEmpty().isString(),
    body("subTitle", "subTitle can not be empty").optional().notEmpty().isString(),
    body("author", "author can not be empty").optional().notEmpty().isString(),
    body("description", "description can not be empty").optional().notEmpty().isString(),
    body("price", "price can not be empty").optional().notEmpty().isNumeric(),
    body("image", "image can not be empty").optional().notEmpty().isArray(),
    body("category", "category can not be empty").optional().notEmpty().isString(),
    body("status", "status can not be empty").optional().notEmpty().isString(),
    body("isSoldOut", "isSoldOut can not be empty").optional().optional().default(false).isBoolean(),
    body("extraAttr", "extraAttr can not be empty").optional().notEmpty().isArray()
  ],

  getProduct: [
    query('product_id', "product_id can not be empty").notEmpty().isString(),
  ],

  getAllProducts: [
    query("pageNumber", "pageNumber parameter should be number").default(1).toInt(),
  ],
  
  deleteProduct: [
    body('product_id', "product_id can not be empty").notEmpty().isString()
  ]
}