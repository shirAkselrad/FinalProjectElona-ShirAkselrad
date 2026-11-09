const path = require("path");
const multer = require("multer");
const { editError } = require("./editTransaction");

const uploadPath = path.join(
  __dirname,
  "..",
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

module.exports = {
  upload,
  prepareEditedProduct,
  replaceProductImages,
};
