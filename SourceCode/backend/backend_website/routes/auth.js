const router = require("express").Router();
const passport = require("passport");
const generator = require("generate-password");
const bcrypt = require("bcryptjs");
const key = require("./../resources/key");
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(key.googleClientID);
const User = require("../models/User");
const Respones = require("../models/Respones");
const {
  registerValidation,
  loginValidation,
  loginApiValidation,
  resetPasswordValidation,
  forgotPasswordValidation,
  resetPasswordMobileVersionValidation,
  verifyOTPValidation,
} = require("../validation/authValidation");
const sendMail = require("./../services/SendMail");
const passportConfig = require("../services/passport");
const jwtHelper = require("../helpers/jwt.helper");
const STATUS = require("../constants/ResponseStatus");
const accessTokenLife = "1h";
const accessTokenSecret =
  process.env.ACCESS_TOKEN || "17110395PhamToanTrungCNTT_BHDN";
const refreshTokenSecret =
  process.env.REFRESH_TOKEN || "17110395PhamToanTrungCNTT_BHDN";
const refreshTokenLife = "3d";
let ListCodeResetPassword = [];
let { TOKEN_LIST } = require("../services/Global");
const ROLES = require("../constants/Roles");
const otpServices = require("../services/otpServices");
const SendSMS = require("../services/SendSMS");
const { verify } = require("./../middleware/verifyToken");

passportConfig();
async function verifyGoogle(token) {
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: key.googleClientID,
  });
  return ticket.getPayload();
}

/**
 * controller register
 * @param {*} req
 * @param {*} res status: 0 success, 2: Email đã tồn tại
 */
router.post("/register", async (req, res) => {
  const { error } = registerValidation(req.body);
  if (error)
    return res.send(
      new Respones(STATUS.INPUT_DATA, null, error.details[0].message)
    );

  const emailExist = await User.findOne({ email: req.body.email });
  if (emailExist) return res.send(new Respones(2, null, "Email đã tồn tại!"));

  const salt = await bcrypt.genSalt(10);

  const hashPassword = await bcrypt.hash(req.body.password, salt);

  const user = new User({
    email: req.body.email,
    password: hashPassword,
    name: req.body.name,
    role: ROLES.CUSTOMER,
    phoneNumber: req.body.phoneNumber,
    $push: {
      addresses: {
        city: req.body.address.city,
        district: req.body.address.district,
        ward: req.body.address.ward,
        streetOrBuilding: req.body.address.streetOrBuilding,
        isDefault: true,
        status: true,
      },
    },
    birthday: req.body.birthday,
    male: req.body.male,
    address: req.body.address,
    status: true,
  });

  try {
    //em lạy anh đừng cmt lung tung bản mobile xài nữa rồi demo hỏi sao k chạy
    const saveUser = await user.save();
    // res.send(new Respones(0));
    const data = { _id: saveUser._id, role: saveUser.role };
    const accessToken = await jwtHelper.generateToken(
      data,
      accessTokenSecret,
      accessTokenLife
    );
    const refreshToken = await jwtHelper.generateToken(
      data,
      refreshTokenSecret,
      refreshTokenLife
    );

    TOKEN_LIST[refreshToken] = { accessToken, refreshToken };

    res.send(
      new Respones(0, {
        userData: {
          _id: saveUser._id,
          email: saveUser.email,
          name: saveUser.name,
          role: saveUser.role,
        },
        accessToken,
        refreshToken,
      })
    );
  } catch (error) {
    res.send(new Respones(STATUS.UNKNOWN_EEROR, null, error.message));
  }
});

/**
 * controller login
 * @param {*} req
 * @param {*} res status: {0: thành công, -1: Email hoặc mật khẩu không chính xác, -2: Tài khoản đang bị khóa}
 */
router.post("/login", async (req, res) => {
  const { error } = loginValidation(req.body);
  if (error)
    return res.send(
      new Respones(STATUS.INPUT_DATA, null, error.details[0].message)
    );

  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user)
      return res.send(
        new Respones(-1, null, "Email hoặc mật khẩu không chính xác!")
      );
    const vaildPass = await bcrypt.compare(req.body.password, user.password);
    if (!vaildPass)
      return res.send(
        new Respones(-1, null, "Email hoặc mật khẩu không chính xác!")
      );

    if (!user.status)
      return res.send(new Respones(-2, null, "Tài khoản đang bị khóa!"));

    const data = { _id: user._id, role: user.role };
    const accessToken = await jwtHelper.generateToken(
      data,
      accessTokenSecret,
      accessTokenLife
    );
    const refreshToken = await jwtHelper.generateToken(
      data,
      refreshTokenSecret,
      refreshTokenLife
    );

    TOKEN_LIST[refreshToken] = { accessToken, refreshToken };

    res.send(
      new Respones(0, {
        userData: {
          _id: user._id,
          email: user.email,
          image: user.image,
          role: user.role,
          name: user.name,
          phoneNumber: user.phoneNumber,
        },
        accessToken,
        refreshToken,
      })
    );
  } catch (error) {
    res.send(new Respones(STATUS.UNKNOWN_EEROR, null, error.message));
  }
});

router.post("/google", async (req, res) => {
  const { error } = loginApiValidation(req.body);
  if (error)
    return res.send(
      new Respones(STATUS.INPUT_DATA, null, error.details[0].message)
    );

  try {
    let result = await verifyGoogle(req.body.tokenId);
    const user = await User.findOne({ email: result.email });
    if (!user) {
      let newPassword = generator.generate({
        length: 10,
        numbers: true,
      });

      const salt = await bcrypt.genSalt(10);

      const hashPassword = await bcrypt.hash(newPassword, salt);

      const newUser = new User({
        email: result.email,
        password: hashPassword,
        googleId: result.sub,
        name: result.name,
        role: ROLES.CUSTOMER,
        phoneNumber: "",
        birthday: "",
        image: result.picture,
        status: true,
      });
      const saveUser = await newUser.save();
      const data = { _id: saveUser._id, role: saveUser.role };
      const accessToken = await jwtHelper.generateToken(
        data,
        accessTokenSecret,
        accessTokenLife
      );
      const refreshToken = await jwtHelper.generateToken(
        data,
        refreshTokenSecret,
        refreshTokenLife
      );

      TOKEN_LIST[refreshToken] = { accessToken, refreshToken };

      res.send(
        new Respones(0, {
          userData: {
            _id: saveUser._id,
            email: saveUser.email,
            image: saveUser.image,
            role: saveUser.role,
            name: saveUser.name,
            phoneNumber: saveUser.phoneNumber,
          },
          accessToken,
          refreshToken,
        })
      );

      sendMail(
        "Tài khoản vừa được đăng nhập",
        req.body.email,
        "<span>Bạn vừa đăng nhập nhập tài khoản bằng Google hoặc Facebook. Dưới đây là mật khẩu mới của bạn!" +
          "</span> </br><h2>" +
          newPassword +
          "</h2>"
      );
    } else {
      if (!user.status)
        return res.send(new Respones(-6, null, "Tài khoản đang bị khóa!"));
      if (!user.googleId)
        await User.updateOne(
          { _id: user._id },
          {
            $set: { googleId: result.sub },
          }
        );
      const data = { _id: user._id, role: user.role };
      const accessToken = await jwtHelper.generateToken(
        data,
        accessTokenSecret,
        accessTokenLife
      );
      const refreshToken = await jwtHelper.generateToken(
        data,
        refreshTokenSecret,
        refreshTokenLife
      );

      TOKEN_LIST[refreshToken] = { accessToken, refreshToken };

      res.send(
        new Respones(0, {
          userData: {
            _id: user._id,
            email: user.email,
            image: user.image,
            role: user.role,
            name: user.name,
            phoneNumber: user.phoneNumber,
          },
          accessToken,
          refreshToken,
        })
      );
    }
  } catch (error) {
    res.send(new Respones(STATUS.UNKNOWN_EEROR, null, error.message));
  }
});

/**
 * function facebookOAuth
 * @param {*} req
 * @param {*} res status: {0: thành công, -1: Email hoặc mật khẩu không chính xác, -2: Tài khoản đang bị khóa}
 */
async function facebookOAuth(req, res, next) {
  if (!req.user)
    return res.send(
      new Respones(STATUS.INPUT_DATA, null, "không tồn tại dữ liệu đầu vào")
    );
  if (!req.user.status)
    return res.send(new Respones(-2, null, "Tài khoản đang bị khóa!"));

  const user = req.user;
  const data = { _id: user._id, role: user.role };
  const accessToken = await jwtHelper.generateToken(
    data,
    accessTokenSecret,
    accessTokenLife
  );
  const refreshToken = await jwtHelper.generateToken(
    data,
    refreshTokenSecret,
    refreshTokenLife
  );

  TOKEN_LIST[refreshToken] = { accessToken, refreshToken };

  res.send(
    new Respones(0, {
      userData: {
        _id: user._id,
        email: user.email,
        image: user.image,
        role: user.role,
        name: user.name,
      },
      accessToken,
      refreshToken,
    })
  );
}

router
  .route("/facebook")
  .post(
    passport.authenticate("facebookToken", { session: false }),
    facebookOAuth
  );

/**
 * controller forgotpassword
 * @param {*} req
 * @param {*} res status: {0: thành công, -1: Không tìm thấy email}
 */
router.post("/forgotpassword", async (req, res) => {
  const { error } = forgotPasswordValidation(req.body);
  if (error)
    return res.send(
      new Respones(STATUS.INPUT_DATA, null, error.details[0].message)
    );

  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.send(new Respones(-1, null, "Không tìm thấy email"));

    const code = generator.generate({
      length: 50,
      numbers: true,
    });

    let date = Date.now();
    let secondNow = date / 1000;

    if (ListCodeResetPassword)
      for (let i = ListCodeResetPassword.length - 1; i >= 0; i--) {
        if (ListCodeResetPassword[i]._id == user._id)
          ListCodeResetPassword.splice(i, 1);
        else if (ListCodeResetPassword[i].date / 1000 - secondNow >= 1200)
          ListCodeResetPassword.splice(i, 1);
      }

    ListCodeResetPassword.push({ _id: user._id, code, date: Date.now() });

    sendMail(
      "Đặt lại mật khẩu",
      req.body.email,
      "<span>Dưới đây là link để đăt lại mật khẩu của bạn, nó có giới hạn trong 20 phút." +
        "Nếu không phải bạn thực hiện hành vi này hãy liên hệ với tôi!</span> </br><a href=" +
        process.env.URL_RESET_PASSWORD +
        code +
        ">Click vào đây để đặt lại mật khẩu</a>"
    );

    return res.send(
      new Respones(
        0,
        null,
        "Email chứa link đặt lại mật khẩu đã được gửi đến email của bạn"
      )
    );
  } catch (error) {
    res.send(new Respones(STATUS.UNKNOWN_EEROR, null, error.message));
  }
});

/**
 * forgotpassword mobile
 * @param {*} req
 * @param {*} res status: {0: thành công, -1: Không tìm thấy email}
 */
router.post("/mobile/forgotpassword", async (req, res) => {
  const { error } = forgotPasswordValidation(req.body);
  if (error)
    return res.send(
      new Respones(STATUS.INPUT_DATA, null, error.details[0].message)
    );

  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) return res.send(new Respones(-1, null, "Không tìm thấy email"));

    const otpCode = otpServices.generateOTP(user._id);

    if (!user.phoneNumber) {
      sendMail(
        "Đặt lại mật khẩu",
        req.body.email,
        `<span>Đây là mã OTP để đăt lại mật khẩu của bạn, nó có giới hạn trong 5 phút: ${otpCode}`
      );
      return res.send(
        new Respones(
          0,
          { email: req.body.email },
          "Mã OTP đã được gửi đến email của bạn, mã có thời hạn 5 phút"
        )
      );
    } else {
      await SendSMS(
        user.phoneNumber,
        `Đây là mã OTP để đăt lại mật khẩu của bạn, nó giới hạn trong 5 phút: ${otpCode}`
      );
      return res.send(
        new Respones(
          0,
          { email: req.body.email },
          "Mã OTP đã được gửi đến điện thoại của bạn, mã có thời hạn 5 phút"
        )
      );
    }
  } catch (error) {
    res.send(new Respones(STATUS.UNKNOWN_EEROR, null, error.message));
  }
});

/**
 * verify otp
 * @param {*} req
 * @param {*} res status: {0: thành công, -1: Không tìm thấy email}
 */
router.post("/verify-otp", async (req, res) => {
  const { error } = verifyOTPValidation(req.body);

  if (error)
    return res.send(
      new Respones(STATUS.INPUT_DATA, null, error.details[0].message)
    );

  try {
    const userId = otpServices.verifyOTP(req.body.code);

    if (!userId)
      return res.send(new Respones(-1, null, "Mã OTP không đúng hoặc hết hạn"));

    const user = await User.findById(userId);
    const data = { _id: user._id, role: user.role };
    const accessToken = await jwtHelper.generateToken(
      data,
      accessTokenSecret,
      accessTokenLife
    );

    return res.send(new Respones(0, { accessToken }));
  } catch (error) {
    res.send(new Respones(STATUS.UNKNOWN_EEROR, null, error.message));
  }
});

/**
 * controller reset-password
 * @param {*} req
 * @param {*} res status: {0: thành công, -1: Phiên bản này đã hết hạn vui lòng thử lại!}
 */

router.post("/reset-password", async (req, res) => {
  const { error } = resetPasswordValidation(req.body);

  if (error)
    return res.send(
      new Respones(STATUS.INPUT_DATA, null, error.details[0].message)
    );

  var currentTime = Date.now();
  var secondNow = currentTime / 1000;

  try {
    if (ListCodeResetPassword)
      for (let i = ListCodeResetPassword.length - 1; i >= 0; i--) {
        if (ListCodeResetPassword[i].date / 1000 - secondNow >= 1200)
          ListCodeResetPassword.splice(i, 1);
        else if (ListCodeResetPassword[i].code == req.body.code) {
          const salt = await bcrypt.genSalt(10);
          const hashPassword = await bcrypt.hash(req.body.password, salt);

          await User.updateOne(
            { _id: ListCodeResetPassword[i]._id },
            {
              $set: {
                password: hashPassword,
              },
            }
          );
          ListCodeResetPassword.splice(i, 1);

          return res.send(
            new Respones(0, null, "Mật khẩu của bạn đã được cập nhật!")
          );
        }
      }
    res.send(
      new Respones(-1, null, "Phiên bản này đã hết hạn vui lòng thử lại!")
    );
  } catch (error) {
    res.send(new Respones(STATUS.UNKNOWN_EEROR, null, error.message));
  }
});

router.post("/mobile/reset-password", verify, async (req, res) => {
  const { error } = resetPasswordMobileVersionValidation(req.body);

  if (error)
    return res.send(
      new Respones(STATUS.INPUT_DATA, null, error.details[0].message)
    );

  try {
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt);

    await User.updateOne(
      { _id: req.user._id },
      {
        $set: {
          password: hashPassword,
        },
      }
    );

    res.send(new Respones(0));
  } catch (error) {
    res.send(new Respones(STATUS.UNKNOWN_EEROR, null, error.message));
  }
});

module.exports = router;
