const router = require("express").Router();
const Notification = require("../models/Notification");
const { verify } = require("../middleware/verifyToken");
const STATUS = require("../constants/ResponseStatus");
const Respones = require("../models/Respones");

router.get("/admin=:admin&pagesize=:pagesize", verify, async (req, res) => {
  try {
    const pageSize = parseInt(req.params.pagesize);
    const isSystem = req.params.admin == "true";
    if (req.user.role == "customer") isSystem = false;
    const condition = isSystem ? {} : { user: req.user._id };
    const _notifications = await Notification.find({ user: req.user._id });
    let notSeen = 0;
    if (_notifications !== null)
      for (let i = _notifications.length - 1; i >= 0; i--)
        if (_notifications[i].check === false) notSeen++;
    const notifications = await Notification.find(condition)
      .populate({ path: "performedBy", select: ["name", "image", "role"] })
      .populate({ path: "target.product", select: ["name"] })
      .sort([["_id", -1]])
      .limit(pageSize);

    const count = await Notification.countDocuments(condition);
    res.send(new Respones(0, { notifications, total: count, notSeen }));
  } catch (error) {
    res.send(new Respones(STATUS.UNKNOWN_EEROR, null, error.message));
  }
});

router.get(
  "/mobile/pageSize=:pageSize&page=:page",
  verify,
  async (req, res) => {
    try {
      const pageSize = parseInt(req.params.pageSize);
      const currentPage = parseInt(req.params.page);
      const condition = { user: req.user._id };
      const _notifications = await Notification.find(condition);
      let notSeen = 0;

      if (_notifications !== null)
        for (let i = _notifications.length - 1; i >= 0; i--)
          if (_notifications[i].check === false) notSeen++;

      const notifications = await Notification.find(condition)
        .populate({ path: "performedBy", select: ["name", "image", "role"] })
        .populate({ path: "target.product", select: ["name"] })
        .sort([["_id", -1]])
        .skip(pageSize * (currentPage - 1))
        .limit(pageSize);

      const count = _notifications.length;

      let totalPage = Math.round(parseFloat(count) / pageSize + 0.5);
      if ((totalPage - 1) * pageSize >= count) totalPage--;
      res.send(
        new Respones(0, {
          notifications,
          pagingInfo: { totalPage, currentPage, pageSize, notSeen },
        })
      );
    } catch (error) {
      res.send(new Respones(STATUS.UNKNOWN_EEROR, null, error.message));
    }
  }
);

router.put("/:_id", verify, async (req, res) => {
  try {
    const _id = req.params._id;
    await Notification.updateOne(
      { _id },
      {
        $set: {
          check: true,
        },
      }
    );
    res.send(new Respones(0));
  } catch (error) {
    res.send(new Respones(STATUS.UNKNOWN_EEROR, null, error.message));
  }
});

module.exports = router;
