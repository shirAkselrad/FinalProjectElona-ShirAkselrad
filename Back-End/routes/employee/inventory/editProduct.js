const express = require("express");
const router = express.Router();
const path = require("path");
const multer = require("multer");
const crypto = require("crypto");
const fs = require("fs");
const dbSingleton = require("../../../dbSingleton");
const db = dbSingleton.getConnection();

//this function will help calculating the hash for each new image, for matching each image file (contant) to it's info in the imgsData
function calculateFileHash(filePath) {
  const fileBuffer = fs.readFileSync(filePath);
  return crypto.createHash("sha256").update(fileBuffer).digest("hex");
}

const addNewProductImgs = (req, res, next) => {
  const { imgsData } = req.body;
  const { product_id } = req.params;

  // no new images added
  if (req.files.length == 0) return next();

  const values = [];
  for (const file of req.files) {
    //calculating for each new file it's hash and matching it with the imgData
    const fileHash = calculateFileHash(file.path);
    const imgData = imgsData.find((img) => img.file_hash == fileHash);
    if (!imgData) {
      return res.status(400).json({
        success: false,
        message:
          "problem with matching at least one of the new images with an image data",
      });
    }
    values.push([
      file.originalname,
      file.filename,
      product_id,
      file.path,
      file.mimetype,
      fileHash,
      imgData.frontImg,
    ]);
  }

  const query = `insert into files (file_name, auto_file_name,product_id, path,file_type, file_hash, frontImg) values ?`;
  db.query(query, [values], (err) => {
    if (err)
      return res.status(500).json({
        success: false,
        message: "Couldn't add new product's images to the files table",
      });
    next();
  });
};

const updateFrontImg = (req, res, next) => {
  const { imgsData } = req.body;
  const { product_id } = req.params;
  const frontImg = imgsData.find((img) => img.frontImg == 1);
  const resetQuery = "update files set frontImg=0 where product_id=?";
  db.query(resetQuery, [product_id], (err) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "Couldn't update product's front image",
      });
    }
    const updateQuery =
      "update files set frontImg=1 where product_id=? and file_hash=?";
    db.query(updateQuery, [product_id, frontImg.file_hash], (err) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: "Couldn't update product's front image",
        });
      }
      next();
    });
  });
};
//deleting all the images which are their hash is not in the file_hash imgsData json
const deleteProductImgs = (req, res, next) => {
  const { imgsData } = req.body;
  const { product_id } = req.params;

  const imgsHashes = imgsData.map((img) => img.file_hash);

  //covering both cases :1. some of existing images are geting deleted. 2. all of the existing images of the products are getting deleted
  const query = "delete from files where product_id=? and file_hash not in (?)";

  db.query(query, [product_id, imgsHashes], (err, results) => {
    if (err) {
      console.log("Couldn't delete the proudct's imgs");
      return res.status(500).json({
        success: false,
        message: "Couldn't delete product's images",
      });
    }
    next();
  });
};
//This path updates the images on an existing product (Images popup)
router.put("/deleteProductImgs/:product_id", deleteProductImgs, (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Product's images have been deleted successfully!",
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

//converting all the product's images info from string format back to json format
const preparingProductImgs = (req, res, next) => {
  try {
    if (req.body.imgsData) req.body.imgsData = JSON.parse(req.body.imgsData);
    next();
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Invalid product's files",
    });
  }
};

//This path responsible of the updating product's details opeation
router.put(
  "/editedProduct/:product_id",
  upload.array("files"),
  preparingProductImgs,
  deleteProductImgs,
  addNewProductImgs,
  updateFrontImg,
  (req, res) => {
    const { product_id } = req.params;
    const {
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
    const query = `update inventory
    set name=?,
        category=?,
        colors=?,
        country_origin=?,
        size=?,
        description=?,
        price=?,
        cost_price=?,
        discount=?,
        quantity=?,
        min_stock=?,
        updated_at=NOW(),
        restock_required=?,
      sales_check_date=?,
      min_sales=?

    where product_id=?
  `;
    db.query(
      query,
      [
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
        product_id,
      ],
      (err, results) => {
        if (err) {
          return res.status(500).json({
            success: false,
            message: "Couldn't update product",
          });
        } else if (results.affectedRows == 0) {
          return res.status(404).json({
            success: false,
            message: "Product not found",
          });
        } else
          return res.status(200).json({
            success: true,
            message: "Product was updated successfully!",
          });
      },
    );
  },
);

module.exports = router;
