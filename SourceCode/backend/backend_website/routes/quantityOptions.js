const router = require("express").Router();
const { verifyTokenAdmin } = require("../middleware/verifyToken");
const QuantityOption = require("../models/QuantityOption");
const {
  postQuantityValidation,
  putQuantityValidation,
} = require("../validation/quantityValidation");
const Product = require("../models/Product");
const ColorOption = require("../models/ColorOption");
const SizeOption = require("../models/SizeOption");
const OrderDetail = require("../models/OrderDetail");
const STATUS = require("../constants/ResponseStatus");
const OrderStatus = require("../constants/OrderStatus");
const Respones = require("../models/Respones");

/**
 * controller post quantity option
 * @param {*} req
 * @param {*} res
 * status: {0 success, -1: Không tìm thấy sản phẩm, -2: Không tìm thấy màu, -3: Không tìm thấy cấu hình, -4: Đã tồn tại màu và cấu hình này}
 */
router.post("/", verifyTokenAdmin, async (req, res) => {
  const { error } = postQuantityValidation(req.body);
  if (error)
    return res.send(
      new Respones(STATUS.INPUT_DATA, null, error.details[0].message)
    );
  try {
    const product = await Product.findById(req.body.productId);
    if (!product)
      return res.send(new Respones(-1, null, "Không tìm thấy sản phẩm"));

    const colorOption = await ColorOption.findById(req.body.colorId);
    if (!colorOption)
      return res.send(new Respones(-2, null, "Không tìm thấy màu"));

    const sizeOption = await SizeOption.findById(req.body.sizeId);
    if (!sizeOption)
      return res.send(new Respones(-3, null, "Không tìm thấy kích cỡ"));

    const check = await QuantityOption.findOne({
      colorId: req.body.colorId,
      sizeId: req.body.sizeId,
    });
    if (check)
      return res.send(new Respones(-4, null, "Đã tồn tại màu và cấu hình này"));
    else {
      const quantityOption = new QuantityOption({
        productId: req.body.productId,
        colorId: req.body.colorId,
        sizeId: req.body.sizeId,
        quantity: req.body.quantity,
      });
      await quantityOption.save();
      res.send(new Respones(0, quantityOption));
    }
  } catch (error) {
    res.send(new Respones(STATUS.UNKNOWN_EEROR, null, error.message));
  }
});

router.get("/productId=:productId", async (req, res) => {
  try {
    let quantityOptions = [];
    quantityOptions = await QuantityOption.find({
      productId: req.params.productId,
    });
    res.send(new Respones(0, quantityOptions));
  } catch (error) {
    console.log(error.message);
    res.send(new Respones(STATUS.UNKNOWN_EEROR, null, error.message));
  }
});

router.get("/admin/productId=:productId", async (req, res) => {
  try {
    let _quantityOptions = [];
    let quantityOptions = [];
    _quantityOptions = await QuantityOption.find({
      productId: req.params.productId,
    });
    for (var i = 0; i < _quantityOptions.length; i++) {
      let orderDetails = await OrderDetail.find({
        quantityId: _quantityOptions[i]._id,
      }).populate({ path: "orderId", select: ["status"] });

      orderDetails = orderDetails.filter(
        (orderDetail) =>
          orderDetail.orderId.status === OrderStatus.PENDING_APPROVE ||
          orderDetail.orderId.status === OrderStatus.PENDING_PAY
      );
      let orderQuantity = 0;
      for (var j = 0; j < orderDetails.length; j++) {
        orderQuantity += orderDetails[j].quantity;
      }
      quantityOptions.push({ ..._quantityOptions[i]._doc, orderQuantity });
    }
    res.send(new Respones(0, quantityOptions));
  } catch (error) {
    console.log(error.message);
    res.send(new Respones(STATUS.UNKNOWN_EEROR, null, error.message));
  }
});

/**
 * controller put quantity option
 * @param {*} req
 * @param {*} res
 * status: {0 success, -1: Không tìm thấy sản phẩm}
 */
router.put("/", verifyTokenAdmin, async (req, res) => {
  const { error } = putQuantityValidation(req.body);
  if (error)
    return res.send(
      new Respones(STATUS.INPUT_DATA, null, error.details[0].message)
    );
  try {
    await QuantityOption.updateOne(
      { _id: req.body._id },
      { $set: { quantity: req.body.quantity } }
    );
    res.send(new Respones(0));
  } catch (error) {
    res.send(new Respones(STATUS.UNKNOWN_EEROR, null, error.message));
  }
});

module.exports = router;
