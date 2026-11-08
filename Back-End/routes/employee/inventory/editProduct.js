const express = require("express");
const router = express.Router();
const path = require("path");
const multer = require("multer");
const dbSingleton = require("../../../dbSingleton");
const db = dbSingleton.getConnection();

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

const prepareEditedProduct = (req, res, next) => {
  try {
    const product = JSON.parse(req.body.product);
    const images = JSON.parse(req.body.images);
    if (!Array.isArray(images) || images.length === 0)
      return res.status(400).json({
        success: false,
        message: "Product must have at least one image",
      });
    let fileIndex = 0;
    const editedImages = images.map((image) => {
      if (image.path) return image;
      const file = req.files[fileIndex++];
      if (!file) throw new Error("Missing image file");
      return {
        file_name: image.file_name,
        file_number: image.file_number,
        path: `/src/assets/productsFiles/${file.filename}`,
      };
    });
    if (fileIndex !== req.files.length) throw new Error("Invalid image file");
    req.body.product = product;
    req.editedImages = editedImages;
    next();
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message || "Invalid product data",
    });
  }
};

const beginEditTransaction = (req, res, next) => {
  dbSingleton.getPoolConnection((err, connection) => {
    if (err)
      return res.status(500).json({
        success: false,
        message: "Couldn't get database connection",
      });
    connection.beginTransaction((err) => {
      if (err) {
        connection.release();
        return res.status(500).json({
          success: false,
          message: "Couldn't start product update",
        });
      }
      req.dbConnection = connection;
      next();
    });
  });
};

const editError = (req, res, status, message) => {
  req.dbConnection.rollback(() => {
    req.dbConnection.release();
    return res.status(status).json({
      success: false,
      message,
    });
  });
};

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

const replaceProductImages = (req, res, next) => {
  const { product_id } = req.params;
  const values = req.editedImages.map((image) => [
    image.file_name,
    product_id,
    image.file_number,
    image.path,
  ]);
  req.dbConnection.query(
    "delete from files where product_id=?",
    [product_id],
    (err) => {
      if (err)
        return editError(
          req,
          res,
          500,
          "Couldn't delete previous product images",
        );
      req.dbConnection.query(
        "insert into files (file_name, product_id, file_number, path) values ?",
        [values],
        (err) => {
          if (err)
            return editError(req, res, 500, "Couldn't save product images");
          next();
        },
      );
    },
  );
};

const commitEditTransaction = (req, res) => {
  req.dbConnection.commit((err) => {
    if (err)
      return editError(req, res, 500, "Couldn't complete product update");
    req.dbConnection.release();
    return res.status(200).json({
      success: true,
      message: "Product was updated successfully!",
    });
  });
};

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
        res.status(200).json({
          success: true,
          message: "Product's files found successfully",
          files: results,
        });
      }
    }
  });
});

//This path responsible of the updating product's details opeation
router.put(
  "/editedProduct/:product_id",
  upload.array("uploading-files"),
  prepareEditedProduct,
  beginEditTransaction,
  updateProductDetails,
  updateProductStatus,
  replaceProductImages,
  commitEditTransaction,
);

module.exports = router;
