const router = require("express").Router();
const jwtHelper = require("../helpers/jwt.helper");
const accessTokenSecret =
  process.env.ACCESS_TOKEN || "17110395PhamToanTrungCNTT_BHDN";
const refreshTokenSecret =
  process.env.REFRESH_TOKEN || "17110395PhamToanTrungCNTT_BHDN";
const accessTokenLife = "1h";
let { TOKEN_LIST } = require("../services/Global");
const User = require("../models/User");
const Respones = require("../models/Respones");
const STATUS = require("../constants/ResponseStatus");

router.get("/", async (req, res) => {
  let refreshToken = req.header("refreshToken");
  if (refreshToken === null)
    return res.send(new Respones(-1, null, "Not exist refresh token"));
  const result = await checkToken(refreshToken);
  return res.send(
    new Respones(
      result.codeStatus,
      { accessToken: result.accessToken },
      result.message
    )
  );
});
module.exports = router;

async function checkToken(refreshToken) {
  let decoded = null;
  let message = null;
  let codeStatus = 0;
  let accessToken = null;
  if (refreshToken && TOKEN_LIST && TOKEN_LIST[refreshToken])
    try {
      decoded = await jwtHelper.verifyToken(refreshToken, refreshTokenSecret);
      accessToken = await jwtHelper.generateToken(
        decoded.data,
        accessTokenSecret,
        accessTokenLife
      );
    } catch (error) {
      message = error.message;
      codeStatus = -1;
    }
  else {
    message = "Invalid refresh token";
    codeStatus = STATUS.INVALID_REFRESH_TOKEN;
  }
  if (codeStatus == 0) {
    const user = await User.findById(decoded.data._id);
    if (user) {
      if (!user.status) {
        codeStatus = -403;
        message = "Account has been block";
      }
    } else {
      codeStatus = -1;
      message = "Can't not found account";
    }
  }
  return { codeStatus, message, accessToken };
}
