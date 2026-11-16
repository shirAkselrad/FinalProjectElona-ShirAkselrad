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
  prepareEditedProduct, //preparing the images rather if they already existed in the be or if they just been uploaded by the user
  beginEditTransaction, //starting transaction
  updateProductDetails, //updating products details according to what have been given in FE
  updateProductStatus, //updating product status if requiref
  replaceProductImages, //deleting product images which was before the update, and instering the updated ones
  commitEditTransaction, //ending transaction
);

module.exports = router;
