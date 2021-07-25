const router = require("express").Router();
const { verify } = require("../middleware/verifyToken");
const STATUS = require("../constants/ResponseStatus");
const Respones = require("../models/Respones");
const Message = require("../Application/Message");

router.get(
  "/messengerId=:messengerId&pageSize=:pageSize&currentPage=:currentPage",
  verify,
  async (req, res) => {
    try {
      const data = await Message.getMessages(
        req.params.messengerId,
        req.params.pageSize,
        req.params.currentPage
      );
      res.send(new Respones(0, data));
    } catch (error) {
      console.log(error.message);
      res.send(new Respones(STATUS.UNKNOWN_EEROR, null, error.message));
    }
  }
);

module.exports = router;
