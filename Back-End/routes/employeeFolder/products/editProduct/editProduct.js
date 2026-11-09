const express = require("express");
const router = express.Router();

const {
  updateProductDetails,
  updateProductStatus,
} = require("./editProductDetails");

const {
  upload,
  prepareEditedProduct,
  replaceProductImages,
} = require("./editProductImages");

const {
  beginEditTransaction,
  commitEditTransaction,
} = require("./editTransaction");

const getProductImages = require("./getProductImages");

router.use("/", getProductImages);

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
