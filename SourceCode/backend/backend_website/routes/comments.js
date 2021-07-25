const router = require("express").Router();
const { verify } = require("./../middleware/verifyToken");
const Comment = require("../models/Comment");
const Product = require("../models/Product");
const Notification = require("../models/Notification");
const {
  postCommentValidation,
  postReplyValidation,
  putCommentValidation,
  putReplyValidation,
  deleteCommentValidation,
  deleteReplyValidation,
} = require("../validation/commentValidation");
const {
  COMMENTED,
  REPLIED_COMMENT,
} = require("../constants/NotificationAction");
const STATUS = require("../constants/ResponseStatus");
const Respones = require("../models/Respones");

router.get("/:productId&pagesize=:pagesize", async (req, res) => {
  const pageSize = parseInt(req.params.pagesize);
  try {
    const comments = await Comment.find({ productId: req.params.productId })
      .populate({ path: "user", select: ["name", "image", "role"] })
      .populate({ path: "replies.user", select: ["name", "image", "role"] })
      .sort([["_id", -1]])
      .limit(pageSize);
    const total = await Comment.countDocuments({
      productId: req.params.productId,
    });
    res.send(new Respones(0, { comments, total }));
  } catch (error) {
    res.send(new Respones(STATUS.UNKNOWN_EEROR, null, error.message));
  }
});

router.post("/", verify, async (req, res) => {
  const { error } = postCommentValidation(req.body);
  if (error)
    return res.send(
      new Respones(STATUS.INPUT_DATA, null, error.details[0].message)
    );

  const comment = new Comment({
    productId: req.body.productId,
    user: req.user._id,
    content: req.body.content,
  });
  try {
    const saveComment = await comment.save();
    await Product.updateOne(
      { _id: req.body.productId },
      { $inc: { numberComment: 1 } }
    );
    const notification = new Notification({
      user: null,
      target: { product: req.body.productId, comment: saveComment._id },
      performedBy: req.user._id,
      action: COMMENTED,
    });
    await notification.save();
    res.send(new Respones(0, saveComment));
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
    await Comment.updateOne(
      { _id: req.body.commentId },
      {
        $push: {
          replies: {
            content: req.body.reply,
            user: req.user._id,
          },
        },
      }
    );
    const comment = await Comment.findById(req.body.commentId)
      .populate({ path: "user", select: ["name", "image", "role"] })
      .populate({ path: "replies.user", select: ["name", "image", "role"] })
      .sort([["_id", -1]]);
    await Product.updateOne(
      { _id: comment.productId },
      { $inc: { numberComment: 1 } }
    );
    const userId = comment.user._id != req.user._id ? comment.user._id : null;
    const notification = new Notification({
      user: userId,
      target: {
        product: comment.productId,
        comment: comment._id,
        replyComment: comment.replies[comment.replies.length - 1]._id,
      },
      performedBy: req.user._id,
      action: REPLIED_COMMENT,
    });
    await notification.save();
    res.send(new Respones(0, comment));
  } catch (error) {
    res.send(new Respones(STATUS.UNKNOWN_EEROR, null, error.message));
  }
});

router.put("/", verify, async (req, res) => {
  const { error } = putCommentValidation(req.body);
  if (error)
    return res.send(
      new Respones(STATUS.INPUT_DATA, null, error.details[0].message)
    );
  try {
    await Comment.updateOne(
      { _id: req.body.commentId, user: req.user._id },
      {
        $set: {
          content: req.body.content,
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
    await Comment.updateOne(
      {
        _id: req.body.commentId,
        replies: { $elemMatch: { _id: req.body.replyId, user: req.user._id } },
      },
      {
        $set: {
          "replies.$.content": req.body.content,
        },
      }
    );
    const comment = await Comment.findById(req.body.commentId)
      .populate({ path: "user", select: ["name", "image", "role"] })
      .populate({ path: "replies.user", select: ["name", "image", "role"] })
      .sort([["_id", -1]]);
    res.send(new Respones(0, comment));
  } catch (error) {
    res.send(new Respones(STATUS.UNKNOWN_EEROR, null, error.message));
  }
});

router.delete("/", verify, async (req, res) => {
  const { error } = deleteCommentValidation(req.body);
  if (error)
    return res.send(
      new Respones(STATUS.INPUT_DATA, null, error.details[0].message)
    );
  try {
    await Comment.deleteOne({ _id: req.body.commentId, user: req.user._id });
    await Notification.deleteMany({ "target.comment": req.body.commentId }); //delete reply của comment đó
    await Product.updateOne(
      { _id: req.body.productId },
      { $inc: { numberComment: -1 } }
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
    await Comment.updateOne(
      { _id: req.body.commentId },
      {
        $pull: {
          replies: {
            _id: req.body.replyId,
            user: req.user._id,
          },
        },
      }
    );
    await Notification.deleteOne({ "target.replyComment": req.body.replyId });
    await Product.updateOne(
      { _id: req.body.productId },
      { $inc: { numberComment: -1 } }
    );
    res.send(new Respones(0));
  } catch (error) {
    res.send(new Respones(STATUS.UNKNOWN_EEROR, null, error.message));
  }
});

module.exports = router;
