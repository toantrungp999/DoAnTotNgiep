const router = require("express").Router();
const upload = require("./verify/multer");
const fs = require("fs");
const STATUS = require("../constants/ResponseStatus");
const Respones = require("../models/Respones");

router.post("/", upload.array("image"), async (req, res) => {
  const cloudinary = require("cloudinary").v2;
  cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
  const urls = [];
  const files = req.files;
  for (const file of files) {
    const { path } = file;
    const uniqueFilename = new Date().toISOString();
    await cloudinary.uploader.upload(
      path,
      { public_id: `blog/${uniqueFilename}`, tags: `blog` }, // directory and tags are optional
      async function (error, image) {
        if (error)
          return res.send(
            new Respones(STATUS.UNKNOWN_EEROR, null, error.message)
          );
        fs.unlinkSync(path);
        urls.push(image);
      }
    );
  }
  res.send(
    new Respones(0, {
      message: "images uploaded successfully",
      data: urls,
    })
  );
});

module.exports = router;
