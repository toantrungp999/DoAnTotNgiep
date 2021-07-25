const router = require("express").Router();
const User = require("../models/User");
const {
  verifyTokenSuperAdmin,
  verify,
} = require("./../middleware/verifyToken");
const { updateUserValidation } = require("../validation/usersValidation");
const mongoose = require("mongoose");
const STATUS = require("../constants/ResponseStatus");
const Respones = require("../models/Respones");
const ROLES = require("../constants/Roles");

router.get("/page=:page", verifyTokenSuperAdmin, async (req, res) => {
  const pageSize = 12;
  const currentPage = parseInt(req.params.page);
  try {
    const users = await User.find(
      {},
      {
        _id: 1,
        name: 1,
        phoneNumber: 1,
        email: 1,
        addresses: 1,
        male: 1,
        status: 1,
      }
    )
      .sort([["_id", -1]])
      .skip(pageSize * (currentPage - 1)) // we will not retrieve all records, but will skip first 'n' records
      .limit(pageSize);
    const count = await User.countDocuments();
    let totalPage = Math.round(parseFloat(count) / pageSize + 0.5);
    if ((totalPage - 1) * pageSize >= count) totalPage--;
    res.send(
      new Respones(0, { users, pagingInfo: { totalPage, currentPage } })
    );
  } catch (error) {
    res.send(new Respones(STATUS.UNKNOWN_EEROR, null, error.message));
  }
});

router.get("/getall", verify, async (req, res) => {
  console.log("getall", req.user._id);
  try {
    const users = await User.find(
      {
        $and: [
          { _id: { $ne: process.env.BOT_ID } },
          { _id: { $ne: req.user._id } },
        ],
      },
      { _id: 1, name: 1, image: 1, role: 1 }
    ).sort([["role", -1]]);
    console.log(users);
    res.send(new Respones(0, users));
  } catch (error) {
    console.log(error.message);
    res.send(new Respones(STATUS.UNKNOWN_EEROR, null, error.message));
  }
});

router.get(
  "/searchString=:searchString&page=:page&pagesize=:pagesize",
  verifyTokenSuperAdmin,
  async (req, res) => {
    const pageSize = parseInt(req.params.pagesize);
    const currentPage = parseInt(req.params.page);
    const searchString = req.params.searchString.toLowerCase();
    try {
      const condition = {
        $or: [
          { name: { $regex: searchString } },
          { email: { $regex: searchString } },
          { phoneNumber: { $regex: searchString } },
          { role: { $regex: searchString } },
        ],
      };
      const users = await User.find(condition, {
        _id: 1,
        name: 1,
        phoneNumber: 1,
        email: 1,
        image: 1,
        addresses: 1,
        male: 1,
        role: 1,
        status: 1,
      })
        .sort([["_id", -1]])
        .skip(pageSize * (currentPage - 1)) // we will not retrieve all records, but will skip first 'n' records
        .limit(pageSize);
      const count = await User.countDocuments(condition);
      let totalPage = Math.round(parseFloat(count) / pageSize + 0.5);
      if (totalPage * pageSize > count) totalPage--;
      res.send(
        new Respones(0, { users, pagingInfo: { totalPage, currentPage } })
      );
    } catch (error) {
      res.send(new Respones(STATUS.UNKNOWN_EEROR, null, error.message));
    }
  }
);

router.get("/:_id", verifyTokenSuperAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params._id, {
      name: 1,
      addresses: 1,
      email: 1,
      image: 1,
      male: 1,
      phoneNumber: 1,
      role: 1,
      status: 1,
    });
    if (!user) res.send(new Respones(-1, null, "Không tìm thấy người dùng"));
    res.send(new Respones(0, user));
  } catch (error) {
    console.log(error.message);
    if (error instanceof mongoose.Error.CastError) res.send(new Respones(0));
    else res.send(new Respones(STATUS.UNKNOWN_EEROR, null, error.message));
  }
});

router.put("/", verifyTokenSuperAdmin, async (req, res) => {
  const { error } = updateUserValidation(req.body);
  if (error)
    return res.send(
      new Respones(STATUS.INPUT_DATA, null, error.details[0].message)
    );

  if (
    req.body.role != ROLES.SUPER_ADMIN &&
    req.body.role != ROLES.ADMIN &&
    req.body.role != ROLES.CUSTOMER
  )
    return res.send(new Respones(STATUS.INPUT_DATA, null, "Role not exsit"));

  try {
    var _id = req.body._id;
    await User.updateOne(
      { _id },
      {
        $set: {
          status: req.body.status,
          role: req.body.role,
        },
      }
    );
    res.send(new Respones(0));
  } catch (error) {
    console.log(error.message);
    res.send(new Respones(STATUS.UNKNOWN_EEROR, null, error.message));
  }
});

module.exports = router;
