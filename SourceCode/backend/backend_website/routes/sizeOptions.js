const router = require("express").Router();
const { verifyTokenSuperAdmin } = require("../middleware/verifyToken");
const SizeOption = require("../models/SizeOption");
const Product = require("../models/Product");
const {
  postSizeValidation,
  putSizeValidation,
} = require("../validation/sizeValidation");
const STATUS = require("../constants/ResponseStatus");
const Respones = require("../models/Respones");

router.post("/", verifyTokenSuperAdmin, async (req, res) => {
  const { error } = postSizeValidation(req.body);
  if (error)
    return res.send(
      new Respones(STATUS.INPUT_DATA, null, error.details[0].message)
    );

  try {
    const product = await Product.findById(req.body.productId);
    if (!product) res.status(400).send("Product not found");

    const sizeOption = new SizeOption({
      productId: req.body.productId,
      size: req.body.size,
    });
    const saveSizeOption = await sizeOption.save();
    res.send(new Respones(0, saveSizeOption));
  } catch (error) {
    res.send(new Respones(STATUS.UNKNOWN_EEROR, null, error.message));
  }
});

router.get("/product/:productId", async (req, res) => {
  try {
    const sizeOption = await SizeOption.find({
      productId: req.params.productId,
    });
    res.send(new Respones(0, sizeOption));
  } catch (error) {
    res.send(new Respones(STATUS.UNKNOWN_EEROR, null, error.message));
  }
});

router.put("/", verifyTokenSuperAdmin, async (req, res) => {
  const { error } = putSizeValidation(req.body);
  if (error)
    return res.send(
      new Respones(STATUS.INPUT_DATA, null, error.details[0].message)
    );

  try {
    await SizeOption.updateOne(
      { _id: req.body._id },
      {
        $set: {
          size: req.body.size,
        },
      }
    );
    res.send(new Respones(0));
  } catch (error) {
    res.send(new Respones(STATUS.UNKNOWN_EEROR, null, error.message));
  }
});

router.get("/:_id", async (req, res) => {
  try {
    const sizeOption = await SizeOption.findById(req.params._id);
    res.send(new Respones(0, sizeOption));
  } catch (error) {
    res.send(new Respones(STATUS.UNKNOWN_EEROR, null, error.message));
  }
});

module.exports = router;
