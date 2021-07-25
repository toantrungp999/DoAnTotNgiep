const random = require("random");

let OTP_LIST = [];

function generateOTP(userId) {
  let otpCode = random.int(100000, 999999);
  let secondNow = Date.now() / 1000;

  while (true) {
    if (!OTP_LIST[otpCode]) break;

    const { date } = OTP_LIST[otpCode];

    // 5 phút
    if (secondNow - date / 1000 > 300) break;

    otpCode = random.int(100000, 999999);
  }

  OTP_LIST[otpCode] = { userId, date: Date.now() };

  return otpCode;
}

function verifyOTP(otp) {
  let secondNow = Date.now() / 1000;

  if (!OTP_LIST[otp]) return null;

  const { date } = OTP_LIST[otp];
  // 5 phút
  if (secondNow - date / 1000 > 300) {
    OTP_LIST[otp] = null;
    return null;
  }

  const userId = OTP_LIST[otp].userId;
  OTP_LIST[otp] = null;
  return userId;
}

module.exports = { generateOTP, verifyOTP };
