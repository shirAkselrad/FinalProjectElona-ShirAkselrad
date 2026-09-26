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
    console.log("FILES RESULTS:", results);

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

router.post("/changeProductStatus", (req, res) => {
  const { product_id, status } = req.body;
  const query = "update inventory set status=? where product_id=?";
  db.query(query, [status, product_id], (err, results) => {
    if (err) {
      console.error("Couldn't change product's status");
      return res.status(500).json({
        success: false,
        message: "Couldn't update product's status",
      });
    }
    console.log("update results: ", results);
    return res.status(200).json({
      success: true,
    });
  });
});

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
  //frontImg is only the index of frontImg
  const { product_id } = req.body;

  const values = req.filesAndIdsArray.map((item) => [
    item.file.originalname,
    item.file.filename,
    product_id,
    item.file.path,
    item.file.mimetype,
    item.frontImg,
  ]);
  const query =
    "insert into files (file_name, auto_file_name, product_id, path, file_type, frontImg) values ?";

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

//This path updates the images on an existing product
router.put("/deleteProductImgs/:product_id", (req, res) => {
  const { imgs } = req.body;
  const { product_id } = req.params;
  const query =
    "delete from files where product_id=? and auto_file_name not in (?)";
  db.query(query, [product_id, imgs], (err, results) => {
    if (err) {
      console.log("Couldn't delete the proudct's imgs");
      return res.status(500).json({
        success: false,
        message: "Couldn't delete product's images",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Product's images have been deleted successfully!",
    });
  });
});

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

router.get("/getProductImages/:product_id", (req, res) => {
  const { product_id } = req.params;
  const query = "select * from files where product_id=?";
  db.query(query, [product_id], (err, results) => {
    if (err) {
      res.status(500).json({
        success: false,
        message: "Couldn't get the files",
      });
    } else {
      if (results.length == 0) {
        res.status(404).json({
          success: false,
          message: "Product not found",
        });
      } else {
        res.status(201).json({
          success: true,
          message: "Product's files found successfully",
          files: results,
        });
      }
    }
  });
});

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
