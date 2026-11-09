const dbSingleton = require("../../../../dbSingleton");
const db = dbSingleton.getConnection();
const { editError } = require("./editTransaction");

const updateProductStatus = (req, res, next) => {
  const { product_id } = req.params;
  const { quantity, restock_required } = req.body.product;
  if (Number(quantity) !== 0 || Number(restock_required) !== 0) return next();
  const query = "update inventory set status='Not Active' where product_id=?";
  req.dbConnection.query(query, [product_id], (err) => {
    if (err) return editError(req, res, 500, "Couldn't update product status");
    next();
  });
};

const updateProductDetails = (req, res, next) => {
  const { product_id } = req.params;
  const product = req.body.product;
  const query = `update inventory set
  name=?, category=?, type=?, colors=?, country_origin=?,
  size=?, description=?, price=?, cost_price=?, discount=?,
  quantity=?, min_stock=?, restock_required=?,
  sales_check_date=?, min_sales=?
  where product_id=?`;
  const values = [
    product.name,
    product.category,
    product.type,
    product.colors.join(","),
    product.country_origin,
    product.size,
    product.description,
    product.price,
    product.cost_price,
    product.discount,
    product.quantity,
    product.min_stock,
    product.restock_required,
    product.sales_check_date,
    product.min_sales,
    product_id,
  ];

  req.dbConnection.query(query, values, (err, results) => {
    if (err) return editError(req, res, 500, "Couldn't update product");
    if (results.affectedRows === 0)
      return editError(req, res, 404, "Product not found");
    next();
  });
};

module.exports = { updateProductDetails, updateProductStatus };
