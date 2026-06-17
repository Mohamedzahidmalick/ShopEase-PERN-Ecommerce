const multer = require("multer");
const path = require("path");
const fs = require("fs");

const uploadDir = "profile_uploads";

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({

  destination: (req, file, cb) => {
    cb(null, "profile_uploads/");
  },

  filename: (req, file, cb) => {

    const unique =
      Date.now() + "-" + Math.round(Math.random() * 1e9);

    cb(null, unique + path.extname(file.originalname));

  }

});

const profileUpload = multer({ storage });

module.exports = profileUpload;