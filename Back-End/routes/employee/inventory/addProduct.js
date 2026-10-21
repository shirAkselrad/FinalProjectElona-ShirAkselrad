const path = require("path");
const express = require("express");
const multer = require("multer");
const router = express.Router();
const dbSingleton = require("../../../dbSingleton");
const db = dbSingleton.getConnection();

/**while creating new product the values that is being send to back-end are:
 * product- json with all the product's details
 * images- json with file_name and file_number
 * uploading-files- the acutal files
 */

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

const uploadPath = path.join(
  __dirname,
  "..",
  "..",
  "..",
  "..",
  "Front-End",
  "src",
  "assets",
  "productsFiles",
);
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

//creating json which includes both image data and the acutal file
const matchFilesWithData = (req, res, next) => {
  req.filesAndData = req.files.map((file, index) => {
    return {
      file: file,
      file_name: req.body.images[index].file_name,
      file_number: req.body.images[index].file_number,
    };
  });
  next();
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

router.post(
  "/createProduct",
  upload.array("uploading-files"),
  parseProductData,
  checkProductId,
  getProductTypeSettings,
  matchFilesWithData,
  createProduct,
  addFiles,
);

module.exports = router;
