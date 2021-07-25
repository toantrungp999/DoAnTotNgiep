// main.js
var nodemailer = require("nodemailer");
var { username, password } = require("./../resources/key");

const option = {
  service: "gmail",
  host: "smtp.gmail.com",
  port: "465",
  secure: false,
  auth: {
    user: username, // email hoặc username
    pass: password, // password
  },
};

module.exports = function sendMail(title, email, html) {
  var transporter = nodemailer.createTransport(option);

  transporter.verify(function (error, success) {
    // Nếu có lỗi.
    if (error) {
      console.log(error);
    } else {
      //Nếu thành công.
      console.log("Kết nối thành công!");
      var mail = {
        from: username, // Địa chỉ email của người gửi
        to: email, // Địa chỉ email của người gửi
        subject: title, // Tiêu đề mail
        html: html,
      };
      //Tiến hành gửi email
      transporter.sendMail(mail, function (error, info) {
        if (error) {
          // nếu có lỗi
          console.log(error);
        } else {
          //nếu thành công
          console.log("Email sent: " + info.response);
        }
      });
    }
  });
};
