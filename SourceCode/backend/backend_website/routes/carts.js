const router = require("express").Router();
const { verify } = require("./../middleware/verifyToken");
const Cart = require("../models/Cart");
const ColorOption = require("../models/ColorOption");
const SizeOption = require("../models/SizeOption");
const QuantityOption = require("../models/QuantityOption");
const {
  postCartValidation,
  putCartValidation,
  putUpdateTypeCartValidation,
} = require("../validation/cartValidation");
const STATUS = require("../constants/ResponseStatus");
const Respones = require("../models/Respones");

router.get("/", verify, async (req, res) => {
  try {
    let carts = await Cart.find({ user: req.user._id })
      .populate({
        path: "colorId",
        select: ["color", "image", "productId"],
      })
      .populate({
        path: "colorId",
        populate: { path: "productId", select: ["name", "price", "saleOff"] },
      })
      .populate({
        path: "sizeId",
        select: ["size"],
      });
    let result = [];
    for (let i = carts.length - 1; i >= 0; i--) {
      let quantityOption = await QuantityOption.findOne({
        colorId: carts[i].colorId._id,
        sizeId: carts[i].sizeId._id,
      });
      if (!quantityOption)
        return res.send(new Respones(-1, null, "QuantityOption not found"));
      let quantityInStore = quantityOption.quantity;

      let tmp = JSON.stringify(carts[i]);
      tmp = tmp.replace(/.$/, ',"quantityInStore":' + quantityInStore + "}");
      result.push(JSON.parse(tmp));
    }
    res.send(new Respones(0, result));
  } catch (error) {
    console.log(error.message);
    res.send(new Respones(STATUS.UNKNOWN_EEROR, null, error.message));
  }
});

/**
 * controller post cart
 * @param {*} req
 * @param {*} res status: {0 success, -1: QuantityOption not found, -2: Không đủ loại sản phẩm này trong kho,
 * -3:Không thể thêm quá 5 sản phẩm cùng 1 loại vào giỏ hàng}
 */
router.post("/", verify, async (req, res) => {
  const { error } = postCartValidation(req.body);
  if (error)
    return res.send(
      new Respones(STATUS.INPUT_DATA, null, error.details[0].message)
    );

  try {
    const quantityOption = await QuantityOption.findOne({
      colorId: req.body.colorId,
      sizeId: req.body.sizeId,
    });
    if (!quantityOption)
      return res.send(new Respones(-1, null, "Loại sản phẩm này tạm hết hàng"));
    let total = quantityOption.quantity;
    if (total === 0)
      return res.send(new Respones(-1, null, "Loại sản phẩm này tạm hết hàng"));
    let quantity = parseInt(req.body.quantity);
    const checkCart = await Cart.findOne({
      user: req.user._id,
      colorId: req.body.colorId,
      sizeId: req.body.sizeId,
    })
      .populate({
        path: "colorId",
        select: ["color", "image", "productId"],
      })
      .populate({
        path: "colorId",
        populate: { path: "productId", select: ["name", "price", "saleOff"] },
      })
      .populate({
        path: "sizeId",
        select: ["size"],
      });
    if (!checkCart) {
      if (total < quantity)
        return res.send(
          new Respones(-2, null, "Không đủ loại sản phẩm này trong kho!")
        );
      if (quantity > 5)
        return res.send(
          new Respones(
            -3,
            null,
            "Không thể thêm quá 5 sản phẩm cùng 1 loại vào giỏ hàng!"
          )
        );
      const cart = new Cart({
        colorId: req.body.colorId,
        sizeId: req.body.sizeId,
        user: req.user._id,
        quantity: req.body.quantity,
      });
      await cart.save();
      const result = await Cart.findById(cart._id)
        .populate({
          path: "colorId",
          select: ["color", "image", "productId"],
        })
        .populate({
          path: "colorId",
          populate: { path: "productId", select: ["name", "price", "saleOff"] },
        })
        .populate({
          path: "sizeId",
          select: ["size"],
        });
      return res.send(new Respones(0, result));
    } else {
      quantity += checkCart.quantity;
      if (quantity > total)
        return res.send(
          new Respones(
            -2,
            null,
            "Đã tồn tại " +
              checkCart.quantity +
              " sản phẩm này. Không đủ loại sản phẩm này trong kho!"
          )
        );
      if (quantity > 5)
        return res.send(
          new Respones(
            -3,
            null,
            "Không thể thêm quá 5 sản phẩm cùng 1 loại vào giỏ hàng!"
          )
        );
      await Cart.updateOne(
        { _id: checkCart._id },
        {
          $set: {
            quantity,
          },
        }
      );
      checkCart.quantity = quantity;
      return res.send(new Respones(0, checkCart));
    }
  } catch (error) {
    res.send(new Respones(STATUS.UNKNOWN_EEROR, null, error.message));
  }
});

router.get("/:_id", async (req, res) => {
  try {
    const cart = await Cart.findById(req.params._id);
    return res.send(new Respones(0, cart));
  } catch (error) {
    res.send(new Respones(STATUS.UNKNOWN_EEROR, null, error.message));
  }
});

/**
 * controller put update cart
 * @param {*} req
 * @param {*} res status: {0 success, -1: Không tìm thấy giỏ hàng!, -2: Không đủ loại sản phẩm này trong kho,
 * -3: Không thể thêm quá 5 sản phẩm cùng 1 loại vào giỏ hàng}
 */
router.put("/", verify, async (req, res) => {
  const { error } = putCartValidation(req.body);
  if (error)
    return res.send(
      new Respones(STATUS.INPUT_DATA, null, error.details[0].message)
    );

  try {
    let quantity = parseInt(req.body.quantity);
    const checkCart = await Cart.findById(req.body._id);
    console.log(checkCart);
    if (checkCart && checkCart.user == req.user._id) {
      // const colorOption = await ColorOption.findById(checkCart.colorId);
      // if (!colorOption)
      //     return res.send(new Respones(-1, null, "ColorOption not found"));
      // const sizeOption = await SizeOption.findById(checkCart.sizeId);
      // if (!sizeOption)
      //     return res.send(new Respones(-1, null, "SizeOption not found"));
      const quantityOption = await QuantityOption.findOne({
        colorId: checkCart.colorId,
        sizeId: checkCart.sizeId,
      });
      if (!quantityOption)
        return res.send(
          new Respones(-1, null, "Loại sản phẩm này tạm hết hàng")
        );
      let total = quantityOption.quantity;
      if (total === 0)
        return res.send(
          new Respones(-1, null, "Loại sản phẩm này tạm hết hàng")
        );
      if (total < quantity)
        return res.send(
          new Respones(-2, null, "Không đủ loại sản phẩm này trong kho!")
        );
      if (quantity > 5)
        return res.send(
          new Respones(
            -3,
            null,
            "Không thể thêm quá 5 sản phẩm cùng 1 loại vào giỏ hàng!"
          )
        );
      await Cart.updateOne(
        { _id: req.body._id },
        {
          $set: {
            quantity,
            date: Date.now(),
          },
        }
      );
      res.send(new Respones(0, null));
    } else res.send(new Respones(-1, null, "Không tìm thấy giỏ hàng!"));
  } catch (error) {
    console.log(error);
    res.send(new Respones(STATUS.UNKNOWN_EEROR, null, error.message));
  }
});

/**
 * controller put update-type cart
 * @param {*} req
 * @param {*} res status: {0 success, -1: Không tìm thấy giỏ hàng!, -2: Không đủ loại sản phẩm này trong kho,
 * -3: Không thể thêm quá 5 sản phẩm cùng 1 loại vào giỏ hàng}
 */
router.put("/update-type", verify, async (req, res) => {
  const { error } = putUpdateTypeCartValidation(req.body);
  if (error)
    return res.send(
      new Respones(STATUS.INPUT_DATA, null, error.details[0].message)
    );

  try {
    let quantity = parseInt(req.body.quantity);
    const existCart = await Cart.findOne({
      user: req.user._id,
      colorId: req.body.colorId,
      sizeId: req.body.sizeId,
    });
    const colorOption = await ColorOption.findById(req.body.colorId);
    if (!colorOption)
      return res.send(new Respones(-1, null, "ColorOption not found"));
    const sizeOption = await SizeOption.findById(req.body.sizeId);
    if (!sizeOption)
      return res.send(new Respones(-1, null, "SizeOption not found"));
    const quantityOptions = await QuantityOption.find({
      colorId: req.body.colorId,
      sizeId: req.body.sizeId,
    });
    if (!quantityOptions)
      return res.send(new Respones(-1, null, "QuantityOption not found"));
    let total = 0;
    for (let pos = 0; pos < quantityOptions.length; pos++)
      total += quantityOptions[pos].quantity;
    let cartId = 0;
    if (existCart && existCart._id != req.body.cartId) {
      let newQuantity = quantity + existCart.quantity;
      if (newQuantity > total)
        return res.send(
          new Respones(-2, null, "Không đủ loại sản phẩm này trong kho!")
        );
      if (newQuantity > 5)
        return res.send(
          new Respones(
            -3,
            null,
            "Không thể thêm quá 5 sản phẩm cùng 1 loại vào giỏ hàng!"
          )
        );
      await Cart.deleteOne({ _id: req.body.cartId });
      await Cart.updateOne(
        { _id: existCart._id },
        {
          $set: {
            quantity: newQuantity,
          },
        }
      );
      cartId = existCart._id;
    } else {
      const checkCart = await Cart.findById(req.body.cartId);
      if (checkCart && checkCart.user == req.user._id) {
        if (quantity > total)
          return res.send(
            new Respones(-2, null, "Không đủ loại sản phẩm này trong kho!")
          );
        if (quantity > 5)
          return res.send(
            new Respones(
              -3,
              null,
              "Không thể thêm quá 5 sản phẩm cùng 1 loại vào giỏ hàng!"
            )
          );
        await Cart.updateOne(
          { _id: req.body.cartId },
          {
            $set: {
              colorId: req.body.colorId,
              sizeId: req.body.sizeId,
              quantity: req.body.quantity,
            },
          }
        );
        cartId = req.body.cartId;
      } else res.send(new Respones(-1, null, "Không tìm thấy giỏ hàng!"));
    }
    const result = await Cart.findById(cartId)
      .populate({
        path: "colorId",
        select: ["color", "image", "productId"],
      })
      .populate({
        path: "colorId",
        populate: { path: "productId", select: ["name", "price", "saleOff"] },
      })
      .populate({
        path: "sizeId",
        select: ["size"],
      });
    let quantityOption = await QuantityOption.findOne({
      colorId: result.colorId._id,
      sizeId: result.sizeId._id,
    });
    if (!quantityOption)
      return res.send(new Respones(-1, null, "QuantityOption not found"));
    let quantityInStore = quantityOption.quantity;
    let tmp = JSON.stringify(result);
    tmp = tmp.replace(/.$/, ',"quantityInStore":' + quantityInStore + "}");
    res.send(new Respones(0, JSON.parse(tmp)));
  } catch (error) {
    res.send(new Respones(STATUS.UNKNOWN_EEROR, null, error.message));
  }
});

/**
 * controller put update-type cart
 * @param {*} req
 * @param {*} res status: {0 success, -1: Không tìm thấy giỏ hàng}
 */
router.delete("/:_id", verify, async (req, res) => {
  try {
    const check = await Cart.deleteOne({
      _id: req.params._id,
      user: req.user._id,
    });
    if (check.n && check.n == 1) return res.send(new Respones(0, null));
    else res.send(new Respones(-1, null, "Không tìm thấy giỏ hàng!"));
  } catch (error) {
    res.send(new Respones(STATUS.UNKNOWN_EEROR, null, error.message));
  }
});

module.exports = router;
