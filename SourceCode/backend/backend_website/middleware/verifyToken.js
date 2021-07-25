const jwtHelper = require("../helpers/jwt.helper");
const accessTokenSecret =
  process.env.ACCESS_TOKEN || "17110395PhamToanTrungCNTT_BHDN";
const User = require("../models/User");
const STATUS = require("../constants/ResponseStatus");
const Respones = require("../models/Respones");
const ROLES = require("../constants/Roles");

const verify = async (req, res, next) => {
  let accessToken = req.header("x-access-token");
  if (accessToken == null)
    return res.send(new Respones(STATUS.INVALID_TOKEN, null, "Invalid Token"));
  const result = await checkToken(accessToken);
  if (result.codeStatus != null)
    return res.send(new Respones(result.codeStatus, null, result.message));
  else {
    accessToken = result.accessToken;
    const decoded = result.decoded;
    try {
      req.user = decoded.data;
      req.accessToken = accessToken;
      res.header("x-access-token", accessToken);
      next();
    } catch (err) {
      return res.send(
        new Respones(STATUS.INVALID_TOKEN, null, "Invalid Token")
      );
    }
  }
};

const verifyTokenAdmin = async (req, res, next) => {
  let accessToken = req.header("x-access-token");
  if (accessToken == null)
    return res.send(new Respones(STATUS.INVALID_TOKEN, null, "Invalid Token"));
  const result = await checkToken(accessToken);
  if (result.codeStatus != null)
    return res.send(new Respones(result.codeStatus, null, result.message));
  else {
    accessToken = result.accessToken;
    const decoded = result.decoded;
    try {
      if (
        decoded.data.role != ROLES.SUPER_ADMIN &&
        decoded.data.role != ROLES.ADMIN
      )
        return res.send(
          new Respones(STATUS.NO_PERMISSION, null, "Access Denied!")
        );
      req.user = decoded.data;
      req.accessToken = accessToken;
      res.header("x-access-token", accessToken);
      next();
    } catch (err) {
      return res.send(
        new Respones(STATUS.INVALID_TOKEN, null, "Invalid Token")
      );
    }
  }
};

const verifyTokenSuperAdmin = async (req, res, next) => {
  let accessToken = req.header("x-access-token");
  if (accessToken == null)
    return res.send(new Respones(STATUS.INVALID_TOKEN, null, "Invalid Token"));
  const result = await checkToken(accessToken);
  if (result.codeStatus != null)
    return res.send(new Respones(result.codeStatus, null, result.message));
  else {
    accessToken = result.accessToken;
    const decoded = result.decoded;
    if (decoded.data.role != ROLES.SUPER_ADMIN)
      return res.send(
        new Respones(STATUS.NO_PERMISSION, null, "Access Denied!")
      );
    req.user = decoded.data;
    req.accessToken = accessToken;
    res.header("x-access-token", accessToken);
    next();
  }
};

const checkToken = async (accessToken) => {
  let decoded = null;
  let message = null;
  let codeStatus = null;
  if (accessToken) {
    try {
      decoded = await jwtHelper.verifyToken(accessToken, accessTokenSecret); //đã kiểm tra hết hạn
    } catch (error) {
      if (error.message == "jwt expired") {
        message = "Token expired";
        codeStatus = STATUS.TOKEN_EXPIRED;
      } else {
        message = "Invalid access token";
        codeStatus = STATUS.INVALID_TOKEN;
      }
    }
  }
  if (!codeStatus) {
    const user = await User.findById(decoded.data._id);
    if (user) {
      if (!user.status) {
        codeStatus = -1;
        message = "Account has been block";
      } else decoded.data.role = user.role;
    } else {
      codeStatus = -1;
      message = "Can't not found account";
    }
  }
  return { codeStatus, message, accessToken, decoded };
};

module.exports.verify = verify;
module.exports.verifyTokenAdmin = verifyTokenAdmin;
module.exports.verifyTokenSuperAdmin = verifyTokenSuperAdmin;
module.exports.checkToken = checkToken;
