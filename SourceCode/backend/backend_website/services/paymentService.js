var sortObject = (module.exports.sortObject = function sortObject(o) {
  var sorted = {},
    key,
    a = [];

  for (key in o) {
    if (o.hasOwnProperty(key)) {
      a.push(key);
    }
  }

  a.sort();

  for (key = 0; key < a.length; key++) {
    sorted[a[key]] = o[a[key]];
  }
  return sorted;
});

module.exports.createVNPayUrl = function createVNPayUrl(
  payId,
  type,
  req,
  order
) {
  var dateFormat = require("dateformat");

  var ipAddr =
    req.headers["x-forwarded-for"] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress;
  var tmnCode = process.env.VNP_TMNCODE;
  var secretKey = process.env.VNP_HASHSECRET;
  var vnpUrl = process.env.VNP_URL;
  var returnUrl =
    process.env.URL_FROND_END.toString() + "orders/" + order._id.toString();

  var date = new Date();

  var createDate = dateFormat(date, "yyyymmddHHmmss");
  var paymentId = payId ? payId : dateFormat(date, "HHmmss");
  var amount = order.total;
  var orderInfo = "ThanhToan";
  var locale = "vn";
  var currCode = "VND";
  var vnp_Params = {};
  vnp_Params["vnp_Version"] = "2";
  vnp_Params["vnp_Command"] = type;
  vnp_Params["vnp_TmnCode"] = tmnCode;
  // vnp_Params['vnp_Merchant'] = ''
  vnp_Params["vnp_Locale"] = locale;
  vnp_Params["vnp_CurrCode"] = currCode;
  vnp_Params["vnp_TxnRef"] = paymentId;
  vnp_Params["vnp_OrderInfo"] = orderInfo;
  vnp_Params["vnp_Amount"] = amount * 100;
  vnp_Params["vnp_ReturnUrl"] = returnUrl;
  vnp_Params["vnp_IpAddr"] = ipAddr;
  vnp_Params["vnp_CreateDate"] = createDate;

  vnp_Params = sortObject(vnp_Params);

  var querystring = require("qs");
  var signData =
    secretKey + querystring.stringify(vnp_Params, { encode: false });

  var sha256 = require("sha256");

  var secureHash = sha256(signData);

  vnp_Params["vnp_SecureHashType"] = "SHA256";
  vnp_Params["vnp_SecureHash"] = secureHash;
  vnpUrl += "?" + querystring.stringify(vnp_Params, { encode: true });
  return { vnpUrl, paymentId };
};
