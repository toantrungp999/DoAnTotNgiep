const router = require("express").Router();
const storeLocation = require("../resources/storeLocation.json");
const STATUS = require("../constants/ResponseStatus");
const Respones = require("../models/Respones");

router.get("/", async (req, res) => {
  try {
    res.send(new Respones(0, storeLocation));
  } catch (error) {
    res.send(new Respones(STATUS.UNKNOWN_EEROR, null, error.message));
  }
});

module.exports = router;
