const dbSingleton = require("../../../../dbSingleton");
const db = dbSingleton.getConnection();

const createProduct = (req, res, next) => {
  const {
    product_id,
    name,
    category,
    type,
    colors,
    country_origin,
    size,
    description,
    price,
    cost_price,
    discount,
    quantity,
    min_stock,
    restock_required,
  } = req.body.product;

  const { min_sales, sales_check_days } = req.productTypeSettings;
  const productMinSales = Math.min(min_sales, Number(quantity));
  const query =
    "insert into inventory (product_id, name, category, type, colors, country_origin, size, description, price, cost_price, discount, quantity, min_stock, status, creation_date, restock_required, sales_check_date, min_sales) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Active', NOW(), ?, DATE_ADD(CURDATE(), INTERVAL ? DAY), ?)";

  db.query(
    query,
    [
      product_id,
      name,
      category,
      type,
      colors.join(", "),
      country_origin,
      size,
      description,
      price,
      cost_price,
      discount,
      quantity,
      restock_required ? min_stock : null,
      restock_required,
      sales_check_days,
      productMinSales,
    ],
    (err, results) => {
      if (err) {
        console.error("Error creating new product:", err);

        return res.status(500).json({
          success: false,
          message: "Error creating new product",
        });
      }

      next();
    },
  );
};

const addFiles = (req, res, next) => {
  //frontImg is only the index of frontImg
  const { product_id } = req.body.product;

  //adding all the values of the files to the file table
  const values = req.filesAndData.map((item) => {
    return [
      item.file_name,
      product_id,
      item.file_number,
      `/src/assets/productsFiles/${item.file.filename}`,
    ];
  });
  const query =
    "insert into files (file_name, product_id, file_number,path) values ?";

  db.query(query, [values], (err, results) => {
    if (err) {
      console.error("Error while trying to create a new product, error: ", err);
      return res.status(500).json({
        success: false,
        message: "Couldn't upload product's files, error: ",
        err,
      });
    }
    return res.status(201).json({
      success: true,
      message: "Product added successfully",
    });
  });
};

module.exports = { createProduct, addFiles };
