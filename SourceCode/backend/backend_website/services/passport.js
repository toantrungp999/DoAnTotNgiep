const passport = require("passport");
const generator = require("generate-password");
const facebookTokenStrategy = require("passport-facebook-token");
const User = require("../models/User");
const sendMail = require("./SendMail");
const bcrypt = require("bcryptjs");
const key = require("../resources/key");
module.exports = function () {
  passport.use(
    "facebookToken",
    new facebookTokenStrategy(
      {
        clientID: key.facebookID,
        clientSecret: key.facebookSecret,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const email = profile.emails[0].value;
          const existingUser = await User.findOne({ email });
          if (existingUser) {
            if (!existingUser.facebookId) {
              var _id = user._id;
              await User.updateOne(
                { _id },
                {
                  $set: {
                    facebookId: profile.id,
                  },
                }
              );
            }
            return done(null, existingUser);
          }
          const newPassword = generator.generate({
            length: 10,
            numbers: true,
          });
          const salt = await bcrypt.genSalt(10);
          const hashPassword = await bcrypt.hash(newPassword, salt);
          const user = new User({
            email: profile.emails[0].value,
            password: hashPassword,
            facebookId: profile.id,
            name: profile.displayName,
            role: "customer",
            phoneNumber: "",
            birthday: "",
            image: profile.photos[0].value,
            status: true,
          });
          sendMail(
            "Tài khoản vừa được đăng nhập",
            user.email,
            "<span>Bạn vừa đăng nhập nhập tài khoản bằng Google hoặc Facebook. Dưới đây là mật khẩu mới của bạn!" +
              "</span> </br><h2>" +
              newPassword +
              "</h2>"
          );
          const saveUser = await user.save();
          done(null, saveUser);
        } catch (error) {
          done(error, false);
        }
      }
    )
  );
};
