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
  parseProductData, //responsible for converthing the string data back to json format
  checkProductId, //checks rather this product already exists
  getProductTypeSettings, //gets all the sales settings of the specific product
  matchFilesWithData, //creating json which includes both image data and the acutal file
  createProduct, //adding into DB the new product details
  addFiles, //adding product files intp the DB
);

module.exports = router;
