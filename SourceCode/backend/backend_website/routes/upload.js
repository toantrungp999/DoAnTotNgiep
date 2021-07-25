const router = require("express").Router();
const multer = require("multer");
const { verify } = require("./../middleware/verifyToken");
const STATUS = require("../constants/ResponseStatus");
const Respones = require("../models/Respones");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
      cb(null, file.originalname);
    } else {
      //reject file
      cb({ message: "Unsupported file format" }, false);
    }
  },
});

router.post("/", verify, (req, res, next) => {
  const upload = multer({ storage, limits: { fileSize: 1024 * 1024 } }).single(
    "image"
  );
  upload(req, res, function (error) {
    if (error)
      return res.send(new Respones(STATUS.UNKNOWN_EEROR, null, error.message));

    if (!req.file)
      return res.send(
        new Respones(STATUS.INPUT_DATA, null, "Không tìm thấy file")
      );
    // SEND FILE TO CLOUDINARY
    const cloudinary = require("cloudinary").v2;
    cloudinary.config({
      cloud_name: process.env.CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    const path = req.file.path;
    const uniqueFilename = new Date().toISOString();

    cloudinary.uploader.upload(
      path,
      { public_id: `blog/${uniqueFilename}`, tags: `blog` }, // directory and tags are optional
      function (error, image) {
        if (error)
          return res.send(
            new Respones(STATUS.UNKNOWN_EEROR, null, error.message)
          );
        // remove file from server
        const fs = require("fs");
        fs.unlinkSync(path);
        // return image details
        res.send(new Respones(0, image));
      }
    );
  });
});

module.exports = router;
