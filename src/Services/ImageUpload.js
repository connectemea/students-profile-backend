//importing the packages
const multer = require("multer");
const path = require("path");

//seting the storage engine
const storage = multer.diskStorage({
  destination: "./public/uploads/",
  filename: (req, file, callback) => {
    callback(
      null,
      `${file.fieldname}-${Date.now()} ${path.extname(file.originalname)}`
    );
  },
});

//init upload method
const upload = multer({
  storage: storage,
  limits: { fileSize: 1 * 1000000 },
  fileFilter: (req, file, callback) => {
    checkFileType(file, callback);
  },
}).single("profile");

//To check the file types
const checkFileType = (file, callback) => {
  //allowed file types
  const fileTypes = /jpeg|png|jpg|gif/;

  //check ext
  const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());

  //check mimetype
  const mimetype = fileTypes.test(file.mimetype);

  //check if the mimetype and extname are valid or not
  return mimetype && extname ? callback(null, true) : callback("Upload image file");
};

module.exports = upload;
