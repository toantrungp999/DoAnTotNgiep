const router = require("express").Router();
const { verify } = require("./../middleware/verifyToken");
const Rate = require("../models/Rate");
const Product = require("../models/Product");
const Notification = require("../models/Notification");
const {
  postRateValidation,
  postReplyValidation,
  putRateValidation,
  putReplyValidation,
  deleteRateValidation,
  deleteReplyValidation,
} = require("../validation/rateValidation");
const { RATED, REPLIED_RATE } = require("../constants/NotificationAction");
const STATUS = require("../constants/ResponseStatus");
const Respones = require("../models/Respones");

router.get("/:productId&pagesize=:pagesize", async (req, res) => {
  const pageSize = parseInt(req.params.pagesize);
  try {
    const rates = await Rate.find({ productId: req.params.productId })
      .populate({ path: "user", select: ["name", "image"] })
      .populate({ path: "replies.user", select: ["name", "image", "role"] })
      .sort([["_id", -1]])
      .limit(pageSize);
    const total = await Rate.countDocuments({
      productId: req.params.productId,
    });
    res.send(new Respones(0, { rates, total }));
  } catch (error) {
    res.send(new Respones(STATUS.UNKNOWN_EEROR, null, error.message));
  }
});

router.post("/", verify, async (req, res) => {
  const { error } = postRateValidation(req.body);
  if (error)
    return res.send(
      new Respones(STATUS.INPUT_DATA, null, error.details[0].message)
    );

  try {
    const check = await Rate.findOne({
      productId: req.body.productId,
      user: req.user._id,
    });
    if (check)
      return res.send(new Respones(-1, null, "Đã đánh giá sản phẩm này"));

    const rate = new Rate({
      productId: req.body.productId,
      user: req.user._id,
      rate: req.body.rate,
      content: req.body.content,
    });
    const saveRate = await rate.save();
    const rates = await Rate.find({ productId: req.body.productId });
    const avg = avgRate(rates);
    await Product.updateOne(
      { _id: req.body.productId },
      {
        $inc: { numberRate: 1 },
        $set: {
          avgRate: avg,
        },
      }
    );
    const notification = new Notification({
      user: null,
      target: { product: req.body.productId, rate: saveRate._id },
      performedBy: req.user._id,
      action: RATED,
    });
    await notification.save();
    res.send(new Respones(0, saveRate));
  } catch (error) {
    res.send(new Respones(STATUS.UNKNOWN_EEROR, null, error.message));
  }
});

router.post("/replies", verify, async (req, res) => {
  const { error } = postReplyValidation(req.body);
  if (error)
    return res.send(
      new Respones(STATUS.INPUT_DATA, null, error.details[0].message)
    );
  try {
    await Rate.updateOne(
      { _id: req.body.rateId },
      {
        $push: {
          replies: {
            content: req.body.reply,
            user: req.user._id,
          },
        },
      }
    );
    const rate = await Rate.findById(req.body.rateId)
      .populate({ path: "user", select: ["name", "image"] })
      .populate({ path: "replies.user", select: ["name", "image", "role"] })
      .sort([["_id", -1]]);
    const userId = rate.user._id != req.user._id ? rate.user._id : null;
    const notification = new Notification({
      user: userId,
      target: {
        product: rate.productId,
        rate: rate._id,
        replyRate: rate.replies[rate.replies.length - 1]._id,
      },
      performedBy: req.user._id,
      action: REPLIED_RATE,
    });
    await notification.save();
    res.send(new Respones(0, rate));
  } catch (error) {
    res.send(new Respones(STATUS.UNKNOWN_EEROR, null, error.message));
  }
});

router.put("/", verify, async (req, res) => {
  const { error } = putRateValidation(req.body);
  if (error)
    return res.send(
      new Respones(STATUS.INPUT_DATA, null, error.details[0].message)
    );
  try {
    await Rate.updateOne(
      { _id: req.body.rateId, user: req.user._id },
      {
        $set: {
          rate: req.body.rate,
          content: req.body.content,
        },
      }
    );
    const rates = await Rate.find({ productId: req.body.productId });
    const avg = avgRate(rates);
    await Product.updateOne(
      { _id: req.body.productId },
      {
        $set: {
          avgRate: avg,
          numberRate: rates.length,
        },
      }
    );
    res.send(new Respones(0));
  } catch (error) {
    res.send(new Respones(STATUS.UNKNOWN_EEROR, null, error.message));
  }
});

router.put("/replies", verify, async (req, res) => {
  const { error } = putReplyValidation(req.body);
  if (error)
    return res.send(
      new Respones(STATUS.INPUT_DATA, null, error.details[0].message)
    );
  try {
    await Rate.updateOne(
      {
        _id: req.body.rateId,
        replies: { $elemMatch: { _id: req.body.replyId, user: req.user._id } },
      },
      {
        $set: {
          "replies.$.content": req.body.content,
        },
      }
    );
    const rate = await Rate.findById(req.body.rateId)
      .populate({ path: "user", select: ["name", "image"] })
      .populate({ path: "replies.user", select: ["name", "image", "role"] })
      .sort([["_id", -1]]);
    res.send(new Respones(0, rate));
  } catch (error) {
    res.send(new Respones(STATUS.UNKNOWN_EEROR, null, error.message));
  }
});

router.delete("/", verify, async (req, res) => {
  const { error } = deleteRateValidation(req.body);
  if (error)
    return res.send(
      new Respones(STATUS.INPUT_DATA, null, error.details[0].message)
    );

  try {
    await Rate.deleteOne({ _id: req.body.rateId, user: req.user._id });
    await Notification.deleteMany({ "target.rate": req.body.rateId }); //delete reply của rate đó
    const rates = await Rate.find({ productId: req.params.productId });
    const avg = avgRate(rates);
    await Product.updateOne(
      { _id: req.body.productId },
      {
        $set: {
          avgRate: avg,
          numberRate: rates.length,
        },
      }
    );
    res.send(new Respones(0));
  } catch (error) {
    res.send(new Respones(STATUS.UNKNOWN_EEROR, null, error.message));
  }
});

router.delete("/replies", verify, async (req, res) => {
  const { error } = deleteReplyValidation(req.body);
  if (error)
    return res.send(
      new Respones(STATUS.INPUT_DATA, null, error.details[0].message)
    );

  try {
    await Rate.updateOne(
      { _id: req.body.rateId },
      {
        $pull: {
          replies: {
            _id: req.body.replyId,
            user: req.user._id,
          },
        },
      }
    );
    await Notification.deleteOne({ "target.replyRate": req.body.replyId });
    res.send(new Respones(0));
  } catch (error) {
    res.send(new Respones(STATUS.UNKNOWN_EEROR, null, error.message));
  }
});

module.exports = router;

function avgRate(array) {
  let sum = 0;
  console.log(array);
  const length = array.length;
  if (length == 0) return 0;
  for (let i = length - 1; i >= 0; i--) {
    sum += array[i].rate;
  }
  return sum / length;
}
