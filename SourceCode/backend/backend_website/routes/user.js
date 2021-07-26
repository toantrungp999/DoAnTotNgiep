const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const { verify } = require("./../middleware/verifyToken");
const {
  updateAvatarValidation,
  putProfileValidation,
  putPasswordValidation,
  postAddressValidation,
  putAddressValidation,
  putPhoneValidation,
} = require("./../validation/userValidation");
const STATUS = require("../constants/ResponseStatus");
const Respones = require("../models/Respones");

router.get("/profile", verify, async (req, res) => {
  try {
    const { _id } = req.user;
    const _user = await User.findById(_id);
    const user = {
      name: _user.name,
      address: _user.address,
      birthday: _user.birthday,
      male: _user.male,
      email: _user.email,
      image: _user.image,
      phoneNumber: _user.phoneNumber,
    };
    res.send(new Respones(0, user));
  } catch (error) {
    res.send(new Respones(STATUS.UNKNOWN_EEROR, null, error.message));
  }
});

router.put("/updateAvatar", verify, async (req, res) => {
  const { error } = updateAvatarValidation(req.body);
  if (error)
    return res.send(
      new Respones(STATUS.INPUT_DATA, null, error.details[0].message)
    );

  try {
    const { _id } = req.user;
    await User.updateOne(
      { _id },
      {
        $set: {
          image: req.body.image,
        },
      }
    );
    res.send(new Respones(0));
  } catch (error) {
    res.send(new Respones(STATUS.UNKNOWN_EEROR, null, error.message));
  }
});

router.put("/profile", verify, async (req, res) => {
  const { error } = putProfileValidation(req.body);
  if (error)
    return res.send(
      new Respones(STATUS.INPUT_DATA, null, error.details[0].message)
    );
  try {
    const { _id } = req.user;
    await User.updateOne(
      { _id },
      {
        $set: {
          name: req.body.name,
          birthday: req.body.birthday,
          male: req.body.male,
        },
      }
    );
    const _user = await User.findById(_id);
    const user = {
      name: _user.name,
      address: _user.address,
      birthday: _user.birthday,
      male: _user.male,
      email: _user.email,
      image: _user.image,
      phoneNumber: _user.phoneNumber,
    };
    res.send(new Respones(0, user));
  } catch (error) {
    res.send(new Respones(STATUS.UNKNOWN_EEROR, null, error.message));
  }
});

router.put("/password", verify, async (req, res) => {
  const { error } = putPasswordValidation(req.body);
  if (error)
    return res.send(
      new Respones(STATUS.INPUT_DATA, null, error.details[0].message)
    );
  try {
    var { _id } = req.user;
    const _user = await User.findById(_id);
    const vaildPass = await bcrypt.compare(req.body.password, _user.password);
    if (vaildPass) {
      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(req.body.newPassword, salt);
      await User.updateOne(
        { _id },
        {
          $set: {
            password: hashPassword,
          },
        }
      );
      res.send(new Respones(0));
    } else res.send(new Respones(-1, null, "Sai mật khẩu"));
  } catch (error) {
    res.send(new Respones(STATUS.UNKNOWN_EEROR, null, error.message));
  }
});

router.put("/phone", verify, async (req, res) => {
  const { error } = putPhoneValidation(req.body);
  if (error)
    return res.send(
      new Respones(STATUS.INPUT_DATA, null, error.details[0].message)
    );
  try {
    const { _id } = req.user;
    const _user = await User.findById(_id);
    const vaildPass = await bcrypt.compare(req.body.password, _user.password);
    if (vaildPass) {
      await User.updateOne(
        { _id },
        {
          $set: {
            phoneNumber: req.body.phoneNumber,
          },
        }
      );
      res.send(new Respones(0));
    } else res.send(new Respones(-1, null, "Sai mật khẩu"));
  } catch (error) {
    res.send(new Respones(STATUS.UNKNOWN_EEROR, null, error.message));
  }
});

router.get("/addresses", verify, async (req, res) => {
  try {
    const { _id } = req.user;
    const _user = await User.findOne({ _id, status: true });
    for (var i = _user.addresses.length - 1; i >= 0; i--) {
      if (!_user.addresses[i].status) _user.addresses.splice(i, 1);
    }
    res.send(new Respones(0, _user.addresses));
  } catch (error) {
    res.send(new Respones(STATUS.UNKNOWN_EEROR, null, error.message));
  }
});

router.post("/addresses", verify, async (req, res) => {
  const { error } = postAddressValidation(req.body);
  if (error)
    return res.send(
      new Respones(STATUS.INPUT_DATA, null, error.details[0].message)
    );

  try {
    const { _id } = req.user;
    if (req.body.isDefault) {
      let _user = await User.findById(_id);
      for (let i = _user.addresses.length - 1; i >= 0; i--) {
        _user.addresses[i].isDefault = false;
      }
      _user.addresses.push({
        city: req.body.city,
        district: req.body.district,
        ward: req.body.ward,
        streetOrBuilding: req.body.streetOrBuilding,
        isDefault: req.body.isDefault,
        status: true,
      });
      await User.updateOne({ _id }, { addresses: _user.addresses });
    } else
      await User.updateOne(
        { _id },
        {
          $push: {
            addresses: {
              city: req.body.city,
              district: req.body.district,
              ward: req.body.ward,
              streetOrBuilding: req.body.streetOrBuilding,
              isDefault: req.body.isDefault,
              status: true,
            },
          },
        }
      );
    let user = await User.findById(_id);
    for (var i = user.addresses.length - 1; i >= 0; i--) {
      if (!user.addresses[i].status) user.addresses.splice(i, 1);
    }
    res.send(new Respones(0, user.addresses));
  } catch (error) {
    res.send(new Respones(STATUS.UNKNOWN_EEROR, null, error.message));
  }
});

router.put("/addresses", verify, async (req, res) => {
  const { error } = putAddressValidation(req.body);
  if (error)
    return res.send(
      new Respones(STATUS.INPUT_DATA, null, error.details[0].message)
    );

  try {
    const { _id } = req.user;
    if (req.body.isDefault) {
      const _user = await User.findById(_id);
      for (let i = _user.addresses.length - 1; i >= 0; i--) {
        if (_user.addresses[i]._id != req.body._id)
          _user.addresses[i].isDefault = false;
        else {
          _user.addresses[i].city = req.body.city;
          _user.addresses[i].district = req.body.district;
          _user.addresses[i].ward = req.body.ward;
          _user.addresses[i].streetOrBuilding = req.body.streetOrBuilding;
          _user.addresses[i].isDefault = req.body.isDefault;
        }
      }
      await User.updateOne({ _id }, { addresses: _user.addresses });
    } else
      await User.updateOne(
        { _id, addresses: { $elemMatch: { _id: req.body._id } } },
        {
          $set: {
            "addresses.$.city": req.body.city,
            "addresses.$.district": req.body.district,
            "addresses.$.ward": req.body.ward,
            "addresses.$.streetOrBuilding": req.body.streetOrBuilding,
            "addresses.$.isDefault": req.body.isDefault,
          },
        }
      );
    res.send(new Respones(0, req.body));
  } catch (error) {
    res.send(new Respones(STATUS.UNKNOWN_EEROR, null, error.message));
  }
});

router.delete("/addresses/:addressId", verify, async (req, res) => {
  try {
    await User.updateOne(
      { _id: req.user._id, "addresses._id": req.params.addressId },
      {
        $set: {
          "addresses.$.status": false,
        },
      }
    );
    res.send(new Respones(0));
  } catch (error) {
    res.send(new Respones(STATUS.UNKNOWN_EEROR, null, error.message));
  }
});

module.exports = router;
