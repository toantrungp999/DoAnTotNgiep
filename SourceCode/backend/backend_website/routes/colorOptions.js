const router = require("express").Router();
const { verifyTokenSuperAdmin } = require("./../middleware/verifyToken");
const ColorOption = require("../models/ColorOption");
const Product = require("../models/Product");
const {
  postColorValidation,
  putColorValidation,
} = require("../validation/colorValidation");
const STATUS = require("../constants/ResponseStatus");
const Respones = require("../models/Respones");

/**
 * controller post colorOption
 * @param {*} req
 * @param {*} res status: {0 success, -1: Không tìm thấy sản phẩm}
 */
router.post("/", verifyTokenSuperAdmin, async (req, res) => {
  const { error } = postColorValidation(req.body);
  if (error)
    return res.send(
      new Respones(STATUS.INPUT_DATA, null, error.details[0].message)
    );
  try {
    const product = await Product.findById(req.body.productId);
    if (!product) res.send(new Respones(-1, null, "Không tìm thấy sản phẩm"));
    const colorOption = new ColorOption({
      productId: req.body.productId,
      color: req.body.color,
      image: req.body.image,
    });
    const saveColorOption = await colorOption.save();
    res.send(new Respones(0, saveColorOption));
  } catch (error) {
    res.send(new Respones(STATUS.UNKNOWN_EEROR, null, error.message));
  }
});

/**
 * controller post colorOption
 * @param {*} req
 * @param {*} res status: {0 success, -1: Không tìm thấy sản phẩm}
 */
router.get("/product/:productId", async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId);
    if (!product) res.send(new Respones(-1, null, "Không tìm thấy sản phẩm"));
    const colorOptions = await ColorOption.find({
      productId: req.params.productId,
    });
    res.send(new Respones(0, colorOptions));
  } catch (error) {
    res.send(new Respones(STATUS.UNKNOWN_EEROR, null, error.message));
  }
});

router.put("/", verifyTokenSuperAdmin, async (req, res) => {
  try {
    const { error } = putColorValidation(req.body);
    if (error)
      return res.send(
        new Respones(STATUS.INPUT_DATA, null, error.details[0].message)
      );
    await ColorOption.updateOne(
      { _id: req.body._id },
      {
        $set: {
          color: req.body.color,
          image: req.body.image,
        },
      }
    );
    res.send(new Respones(0, null));
  } catch (error) {
    res.send(new Respones(STATUS.UNKNOWN_EEROR, null, error.message));
  }
});

router.get("/:_id", async (req, res) => {
  try {
    const colorOption = await ColorOption.findById(req.params._id);
    res.send(new Respones(0, colorOption));
  } catch (error) {
    res.send(new Respones(STATUS.UNKNOWN_EEROR, null, error.message));
  }
});

module.exports = router;
