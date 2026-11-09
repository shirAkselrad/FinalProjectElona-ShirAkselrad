const path = require("path");
const multer = require("multer");

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

//creating json which includes both image data and the acutal file
const matchFilesWithData = (req, res, next) => {
  req.filesAndData = req.files.map((file, index) => {
    return {
      file: file,
      file_name: req.body.images[index].file_name,
      file_number: req.body.images[index].file_number,
    };
  });
  next();
};

module.exports = { upload, matchFilesWithData };
