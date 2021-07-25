const router = require("express").Router();
const { verify } = require("../middleware/verifyToken");
const STATUS = require("../constants/ResponseStatus");
const Respones = require("../models/Respones");
const Message = require("../Application/Message");
const ROLES = require("../constants/Roles");

router.get("/", verify, async (req, res) => {
  try {
    const isAdmin = req.user.role !== ROLES.CUSTOMER;
    const messengers = await Message.getMessengers(req.user._id, isAdmin);
    res.send(new Respones(0, messengers));
  } catch (error) {
    console.log(error.message);
    res.send(new Respones(STATUS.UNKNOWN_EEROR, null, error.message));
  }
});

module.exports = router;
