const dbSingleton = require("../../../../dbSingleton");
const db = dbSingleton.getConnection();

//this middleware responsible for converthing the string data back to json format
const parseProductData = (req, res, next) => {
  try {
    req.body.product = JSON.parse(req.body.product);
    req.body.images = JSON.parse(req.body.images);
    next();
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: "Invalid product's data",
    });
  }
};

//This middleware checks rather this product already exists
const checkProductId = (req, res, next) => {
  const newProductId = req.body.product.product_id;
  const query = "select product_id from inventory where product_id=?";
  db.query(query, [newProductId], (err, results) => {
    if (err) {
      console.error("Couldn't get all products ids, error: ", err);
      return res.status(500).json({
        success: false,
        message: "Couldn't check product's id",
      });
    }
    if (results.length > 0) {
      return res.status(409).json({
        success: false,
        message: "Couldn't add a new product, product id already exists",
      });
    }
    next();
  });
};

//this middleware gets all the sales settings of the specific product
const getProductTypeSettings = (req, res, next) => {
  const { category, type } = req.body.product;
  const query = `select min_sales, sales_check_days from category_types where name=? and category_id=(select category_id from categories where name=?)`;
  db.query(query, [type, category], (err, results) => {
    if (err)
      return res.status(500).json({
        success: false,
        message: "Couldn't get product type settings",
      });
    if (results.length === 0)
      return res.status(400).json({
        success: false,
        message: "Product type not found",
      });
    req.productTypeSettings = results[0];
    next();
  });
};

module.exports = {
  parseProductData,
  checkProductId,
  getProductTypeSettings,
};
