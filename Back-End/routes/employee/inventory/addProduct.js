const path = require("path");
const express = require("express");
const multer = require("multer");
const router = express.Router();
const crypto = require("crypto");
const fs = require("fs");
const dbSingleton = require("../../../dbSingleton");
const db = dbSingleton.getConnection();

//This middleware checks rather this product already exists
const checkProductId = (req, res, next) => {
  const newProductId = req.body.product_id;
  const query = "select product_id from inventory where product_id=?";
  db.query(query,[newProductId], (err, results) => {
    console.log("FILES RESULTS:", results);

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

const createProduct = (req, res, next) => {
  const {
    product_id,
    name,
    category,
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
    sales_check_date,
    min_sales,
  } = req.body;

  const query =
    "insert into inventory (product_id, name, category, colors, country_origin, size, description, price, cost_price, discount, quantity, min_stock, status, creation_date, updated_at, restock_required, sales_check_date, min_sales) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Active', NOW(), NOW(), ?, ?, ?)";

  db.query(
    query,
    [
      product_id,
      name,
      category,
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

//this function responsible of the file hashing
function calculateFileHash(filePath) {
  const fileBuffer = fs.readFileSync(filePath);

  return crypto.createHash("sha256").update(fileBuffer).digest("hex");
}

const addFiles = (req, res, next) => {
  //frontImg is only the index of frontImg
  const { product_id } = req.body;

  //adding all the values of the files to the file table
  const values = req.filesAndIdsArray.map((item) => {
    //file hashing helps recognise rather the file already exists or not
    const fileHash = calculateFileHash(item.file.path);
    return [
      item.file.originalname,
      item.file.filename,
      product_id,
      item.file.path,
      item.file.mimetype,
      fileHash,
      item.frontImg,
    ];
  });
  const query =
    "insert into files (file_name, auto_file_name, product_id, path, file_type, file_hash, frontImg) values ?";

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

const matchFilesWithIds = (req, res, next) => {
  const { filesId } = req.body;
  //converting from string to array
  const filesIdArr = Array.isArray(filesId) ? filesId : [filesId];

  req.filesAndIdsArray = req.files.map((file, index) => {
    return {
      file: file,
      id: filesIdArr[index],
    };
  });
  next();
};

const markingFrontImg = (req, res, next) => {
  const { frontImg } = req.body;

  console.log("frontImg:", frontImg, typeof frontImg);
  console.log("files:", req.filesAndIdsArray);

  req.filesAndIdsArray = req.filesAndIdsArray.map((item) => {
    return {
      ...item,
      frontImg: item.id === frontImg,
    };
  });
  next();
};

// //This path is for creating new product
router.post(
  "/createProduct",
  upload.array("uploading-files"),
  checkProductId,
  createProduct,
  matchFilesWithIds,
  markingFrontImg,
  addFiles,
);

module.exports = router;
