const express = require("express");
const router = express.Router();

const {
  parseProductData,
  checkProductId,
  getProductTypeSettings,
} = require("./productDetails");

const { upload, matchFilesWithData } = require("./productImages");
const { createProduct, addFiles } = require("./saveProduct");

/**while creating new product the values that is being send to back-end are:
 * product- json with all the product's details
 * images- json with file_name and file_number
 * uploading-files- the acutal files
 */

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
