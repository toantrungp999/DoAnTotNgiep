const Message = require("../Application/Message");
const Verify = require("../middleware/verifyToken");
const Extention = require("../services/Extention");
const ROLE = require("../constants/Roles");

var userOnline = []; //danh sách user dang online

function findIndexOfSocketId(userId) {
  for (let i = userOnline.length - 1; i >= 0; i--)
    if (userOnline[i].userId === userId) return i;
  return -1;
}

module.exports.disconnect = (socketId) => {
  let index = Extention.findIndexById(userOnline, socketId);
  if (index > -1) userOnline.splice(index, 1);
};

module.exports.getMessengers = async (io, socketId) => {
  try {
    const index = Extention.findIndexById(userOnline, socketId);
    if (index === -1) {
      io.sockets.in(socketId).emit("verifyFail", {
        msg: "verify Fail",
      });
      console.log("Can not veryfy!");
      return;
    }

    const messengers = await Message.getMessengers(userOnline[index].userId);
    io.sockets.in(socketId).emit("getMessengers", {
      messengers,
    });
  } catch (error) {
    console.log(error.message);
    io.sockets.in(socketId).emit("socket-fail", {
      msg: error.message,
    });
  }
};

module.exports.updateMessengerCheck = async (io, socketId, messengerId) => {
  try {
    const index = Extention.findIndexById(userOnline, socketId);
    if (index === -1) {
      io.sockets.in(socketId).emit("verifyFail", {
        msg: "verify Fail",
      });
      console.log("Can not veryfy!");
      return;
    }

    const result = await Message.updateMessengerCheck(messengerId);

    //trả về người gửi ok
    io.sockets.in(socketId).emit("updateMessengerCheck", {
      messengerId,
    });

    const senderId =
      userOnline[index].userId != result.user1 ? result.user1 : result.user2;
    const reciverId = senderId != result.user1 ? result.user1 : result.user2;

    //1 trong 2 là null
    if (!senderId || !reciverId)
      for (let i = userOnline.length - 1; i >= 0; i--) {
        if (
          userOnline[i].role !== ROLE.CUSTOMER &&
          userOnline[index].userId !== userOnline[i].userId
        )
          io.sockets.in(userOnline[i]._id).emit("updateMessengerCheck", {
            messengerId,
          });
      }

    if (!reciverId) return;

    const indexTo = findIndexOfSocketId(reciverId);

    if (indexTo > -1)
      io.sockets.in(userOnline[indexTo]._id).emit("updateMessengerCheck", {
        messengerId,
      });

    return;
  } catch (error) {
    console.log(error.message);
    io.sockets.in(socketId).emit("socket-fail", {
      msg: error.message,
    });
    return;
  }
};

module.exports.sendMessage = async (
  io,
  socketId,
  to,
  content,
  isCustomerCare
) => {
  try {
    const index = Extention.findIndexById(userOnline, socketId);
    if (index === -1) {
      io.sockets.in(socketId).emit("verifyFail", {
        msg: "verify Fail",
      });
      console.log("Can not veryfy!");
      return -1;
    }

    const result = await Message.sendMessageToUser(
      isCustomerCare ? null : userOnline[index].userId,
      to,
      content
    );
    io.sockets.in(socketId).emit("sendMessageToUser", {
      result,
    });

    if (isCustomerCare || !to) {
      for (let i = userOnline.length - 1; i >= 0; i--) {
        if (
          userOnline[i].role !== ROLE.CUSTOMER &&
          userOnline[index].userId !== userOnline[i].userId
        )
          io.sockets.in(userOnline[i]._id).emit("sendMessageToUser", {
            result,
          });
      }
    }

    if (!to) return index;

    const indexTo = findIndexOfSocketId(to);

    if (indexTo > -1)
      io.sockets.in(userOnline[indexTo]._id).emit("sendMessageToUser", {
        result,
      });

    return index;
  } catch (error) {
    console.log(error.message);
    io.sockets.in(socketId).emit("senMessageFail", {
      msg: error.message,
    });
    return -1;
  }
};

module.exports.sendMessageToBot = async (io, socketId, content) => {
  try {
    const index = await this.sendMessage(
      io,
      socketId,
      process.env.BOT_ID,
      content
    );
    if (index === -1) return;

    const result = await Message.sendMessageToBot(
      userOnline[index].userId,
      content
    );
    io.sockets.in(socketId).emit("sendMessageToBot", {
      result,
    });

    const indexBot = findIndexOfSocketId(process.env.BOT_ID);
    if (indexBot > -1)
      io.sockets.in(userOnline[indexBot]._id).emit("sendMessageToBot", {
        result,
      });
  } catch (error) {
    console.log(error.message);
    io.sockets.in(socketId).emit("senMessageFail", {
      msg: error.message,
    });
  }
};

module.exports.login = async (io, socketId, accessToken) => {
  try {
    if (Extention.findIndexById(userOnline, socketId) >= 0) {
      //đã tồn tại
      return false;
    } else {
      const result = await Verify.checkToken(accessToken);
      if (result.codeStatus != null) return null;
      console.log(result.decoded.data);
      userOnline.push({
        _id: socketId,
        userId: result.decoded.data._id,
        role: result.decoded.data.role,
      });
      io.sockets.in(socketId).emit("login", {
        socketId,
        userId: result.decoded.data._id,
      });
      return true;
    }
  } catch (error) {
    console.log(error.message);
    io.sockets.in(socketId).emit("senMessageFail", {
      msg: error.message,
    });
  }
};
