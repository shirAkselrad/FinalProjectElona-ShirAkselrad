const path = require("path");
const express = require("express");
const multer = require("multer");

const router = express.Router();

const dbSingleton = require("../../dbSingleton");
const db = dbSingleton.getConnection();

//This middleware checks rather this product already exists
const checkProductId = (req, res, next) => {
  const newProductId = req.body.product_id;
  const query = "select product_id from inventory";
  db.query(query, (err, results) => {
    if (err) {
      console.error("Couldn't get all products ids, error: ", err);
      return res.status(500).json({
        success: false,
        message: "Couldn't check product's id",
      });
    }
    for (let i = 0; i < results.length; i++) {
      if (results[i].product_id === newProductId)
        return res.status(500).json({
          success: false,
          message: "Product id already exists",
        });
    }
    next();
  });
};

const createProduct = (req, res, next) => {
  const {
    product_id,
    name,
    category,
    color,
    country_origin,
    size,
    description,
    price,
    cost_price,
    discount,
    quantity,
    min_stock,
    status,
    restock_required,
    sales_check_date,
    min_sales,
  } = req.body;
  const query =
    "insert into inventory (product_id,name, category, color, country_origin, size, description, price, cost_price, discount, quantity, min_stock, status, creation_date, updated_at, restock_required, sales_check_date, min_sales) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW(), ?, ?, ?) ";

  db.query(
    query,
    [
      product_id,
      name,
      category,
      color,
      country_origin,
      size,
      description,
      price,
      cost_price,
      discount,
      quantity,
      min_stock,
      status,
      restock_required,
      sales_check_date,
      min_sales,
    ],
    (err, results) => {
      if (err)
        return res.status(500).json({
          success: false,
          message: "Error creating new product",
        });
      next();
    },
  );
};

const uploadPath = path.join(
  __dirname,
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

const addFiles = (req, res, next) => {
  const { product_id } = req.body;
  const files = req.files;

  const values = files.map((file) => [
    file.originalname,
    file.filename,
    product_id,
    file.path,
    file.mimetype,
  ]);
  const query =
    "insert into files (file_name, auto_file_name, product_id, path, file_type) values ?";

  db.query(query, [values], (err, results) => {
    if (err)
      return res.status(500).json({
        success: false,
        message: "Couldn't upload product's files, error: ",
        err,
      });
    return res.status(201).json({
      success: true,
      message: "Product added successfully",
    });
  });
};
//This path returns all the inventory details from back-end to front-end
router.get("/inventory", (req, res) => {
  const query = "select  * from inventory";
  db.query(query, (err, results) => {
    if (err) {
      console.error("Could not get inventory, error: ", err);
      return res.status(500).json({
        success: false,
        message: "Could not get inventory",
      });
    }
    return res.status(200).json({
      success: true,
      inventory: results,
    });
  });
});

// //This path is for creating new product
router.post(
  "/createProduct",
  upload.array("uploading-files"),
  checkProductId,
  createProduct,
  addFiles,
);
module.exports = router;
