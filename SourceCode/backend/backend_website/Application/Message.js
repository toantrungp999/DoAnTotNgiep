const Messenger = require("../models/Messenger");
const Message = require("../models/Message");
const Brand = require("../models/Brand");
const User = require("../models/User");
const CategoryGroup = require("../models/CategoryGroup");
const Category = require("../models/Category");
const Product = require("../models/Product");
const QuantityOption = require("../models/QuantityOption");
const { apiCaller } = require("../services/apiCaller");
const Types = require("../constants/ChatBotTypes");
const Extention = require("../services/Extention");

async function getMessengers(userId, isAdmin) {
  if (!userId) throw new Error("userId must has value!");
  //await Messenger.deleteMany();
  return await Messenger.find({
    $or: !isAdmin
      ? [{ user1: userId }, { user2: userId }]
      : [
          { user1: userId },
          { user2: userId },
          { user1: null },
          { user2: null },
        ],
  })
    .sort([["date", -1]])
    .populate({ path: "user1", select: ["name", "image"] })
    .populate({ path: "user2", select: ["name", "image"] });
}

async function updateMessengerCheck(messengerId) {
  console.log(messengerId);
  const messenger = await Messenger.findById(messengerId);
  await Messenger.updateOne({ _id: messengerId }, { $set: { check: true } });
  messenger.check = true;
  return messenger;
}

async function getMessages(messengerId, pageSize, currentPage) {
  currentPage = Math.abs(parseInt(currentPage));
  pageSize = Math.abs(parseInt(pageSize));

  const messages = await Message.find({ messengerId })
    .sort([["_id", -1]])
    .skip(pageSize * (currentPage - 1))
    .limit(pageSize);

  const count = await Message.countDocuments({ messengerId });

  let totalPage = Math.round(parseFloat(count) / pageSize + 0.5);
  if ((totalPage - 1) * pageSize >= count) totalPage--;

  return { messages, pagingInfo: { totalPage, currentPage, pageSize } };
}

async function sendMessageToUser(sendBy, to, content) {
  if (!content) throw new Error("content must has value!");
  const checkMessengerExist = await Messenger.findOne({
    $or: [
      { user1: sendBy, user2: to },
      { user1: to, user2: sendBy },
    ],
  });
  //message of messenger
  let message;

  if (checkMessengerExist === null) {
    message = { sender: "user1", type: "msg", content: content };

    const messenger = new Messenger({
      user1: sendBy,
      user2: to,
      message: message,
    });
    await messenger.save();

    message.messengerId = messenger._id;
    const _message = new Message(message);
    await _message.save();

    return {
      messenger: await Messenger.findById(messenger._id)
        .populate({ path: "user1", select: ["name", "image"] })
        .populate({ path: "user2", select: ["name", "image"] }),
    };
  } else {
    const dateNow = Date.now();
    message = {
      sender: checkMessengerExist.user1 == sendBy ? "user1" : "user2",
      type: "msg",
      content: content,
    };

    await Messenger.updateOne(
      { _id: checkMessengerExist._id },
      {
        message: message,
        date: dateNow,
        check: false,
      }
    );

    message.messengerId = checkMessengerExist._id;
    const _message = new Message(message);
    await _message.save();

    checkMessengerExist.date = dateNow;
    checkMessengerExist.message = message;

    return { messenger: checkMessengerExist };
  }
}

async function sendMessageToBot(sendBy, content) {
  if (!content) throw new Error("content must has value!");

  const to = process.env.BOT_ID;

  const checkMessengerExist = await Messenger.findOne({
    $or: [
      { user1: sendBy, user2: to },
      { user1: to, user2: sendBy },
    ],
  });
  const result = await SendMessageToBot(content, sendBy);
  // return;

  const sender = checkMessengerExist.user1 == sendBy ? "user1" : "user2";
  const reciver = sender == "user1" ? "user2" : "user1";

  let message = { sender: reciver, type: result.type, content: result.data };
  const dateNow = Date.now();
  await Messenger.updateOne(
    { _id: checkMessengerExist._id },
    {
      message: message,
      date: dateNow,
      check: false,
    }
  );

  message.messengerId = checkMessengerExist._id;
  const _message = new Message(message);
  await _message.save();

  checkMessengerExist.date = dateNow;
  checkMessengerExist.message = message;
  return { messenger: checkMessengerExist };
}

async function SendMessageToBot(message, userId) {
  const response = await apiCaller("POST", process.env.URL_CHAT_BOT, {
    message,
  });
  if (response.data && response.data.code == process.env.CODE_SUCCESS) {
    const data = response.data.data;
    let result = null;
    let product;
    let tmp;
    let categorys;
    switch (data.type) {
      case Types.ASK_PRODUCT:
        tmp = await Product.find({ $text: { $search: data.data.productName } })
          .select("_id name images")
          .limit(1);
        if (tmp) {
          product = tmp[0];
          product.images = [product.images[0]];
          const quantityOptions = await QuantityOption.find({
            productId: product._id,
          })
            .populate({ path: "colorId", select: ["color"] })
            .populate({ path: "sizeId", select: ["size"] });
          if (data.data.color && !data.data.size.trim()) {
            for (let i = quantityOptions.length - 1; i >= 0; i--)
              if (
                !Extention.stringToSlug(
                  quantityOptions[i].colorId.color
                ).includes(data.data.color.trim())
              )
                quantityOptions.splice(i, 1);
          } else if (data.data.size && !data.data.color.trim()) {
            for (let i = quantityOptions.length - 1; i >= 0; i--)
              if (
                !Extention.stringToSlug(
                  quantityOptions[i].colorId.color
                ).includes(data.data.size.trim())
              )
                quantityOptions.splice(i, 1);
          } else if (data.data.size && data.data.color) {
            for (let i = quantityOptions.length - 1; i >= 0; i--)
              if (
                !Extention.stringToSlug(
                  quantityOptions[i].colorId.color
                ).includes(data.data.color.trim()) ||
                !Extention.stringToSlug(
                  quantityOptions[i].sizeId.size
                ).includes(data.data.size.trim())
              )
                quantityOptions.splice(i, 1);
          }

          const _quantityOptions = [];
          for (let i = quantityOptions.length - 1; i >= 0; i--) {
            if (quantityOptions[i].quantity !== 0) {
              _quantityOptions.push({
                _id: quantityOptions[i]._id,
                quantity: quantityOptions[i].quantity,
                colorId: quantityOptions[i].colorId._id,
                color: quantityOptions[i].colorId.color,
                sizeId: quantityOptions[i].sizeId._id,
                size: quantityOptions[i].sizeId.size,
              });
            }
          }

          let infoMore = "";
          if (quantityOptions.length > 0 && _quantityOptions.length == 0)
            infoMore = "Sản phảm này hiện đã hết hàng";
          else if (
            quantityOptions.length === 0 &&
            (data.data.size.trim() || data.data.color.trim())
          ) {
            infoMore = "Không tìm thấy size, màu theo thông tin bạn đưa ra";
          } else if (quantityOptions.length === 0)
            infoMore = "Sản phảm này hiện không có trong kho";

          result = {
            type: Types.ASK_PRODUCT,
            data: { product, quantityOptions: _quantityOptions, infoMore },
          };
        } else {
          result = { type: "msg", data: "Không tìm thấy sản phẩm!" };
        }
        break;
      case Types.ASK_BEST_RATE:
        tmp = await Product.find()
          .select("_id name images numberRate avgRate")
          .sort([
            ["numberRate", -1],
            ["avgRate", -1],
          ])
          .limit(1);
        if (tmp) {
          product = tmp[0];
          product.images = [product.images[0]];
        }
        result = {
          type: Types.ASK_BEST_RATE,
          data: product,
        };
        break;
      case Types.ASK_BEST_SELL:
        tmp = await Product.find()
          .select("_id name images numberBuy")
          .sort([["numberBuy", -1]])
          .limit(1);
        if (tmp) {
          product = tmp[0];
          product.images = [product.images[0]];
        }
        result = {
          type: Types.ASK_BEST_SELL,
          data: product,
        };
        break;
      case Types.ASK_BEST_VIEW:
        tmp = await Product.find()
          .select("_id name images numberVisit")
          .sort([["numberVisit", -1]])
          .limit(1);
        if (tmp) {
          product = tmp[0];
          product.images = [product.images[0]];
        }
        result = {
          type: Types.ASK_BEST_VIEW,
          data: product,
        };
        break;
      case Types.ASK_BRANDS:
        const brands = await Brand.find({ status: true })
          .select("_id name")
          .select("_id name")
          .limit(8);
        result = { type: Types.ASK_BRANDS, data: brands };
        break;
      case Types.ASK_CATEGORIES:
        const categoryGroups = await CategoryGroup.find({ status: true })
          .select("_id name")
          .limit(8);
        result = { type: Types.ASK_CATEGORIES, data: categoryGroups };
        break;
      case Types.ASK_CATEGORIES_T_SHIRT:
        categorys = await Category.find({
          categoryGroupId: Types.T_SHIRT_CATEGORY_ID,
        })
          .select("_id name")
          .limit(8);
        result = { type: Types.ASK_CATEGORIES, data: categorys };
        break;
      case Types.ASK_CATEGORIES_SHIRT:
        categorys = await Category.find({
          categoryGroupId: Types.SHIRT_CATEGORY_ID,
        })
          .select("_id name")
          .limit(8);
        result = { type: Types.ASK_CATEGORIES, data: categorys };
        break;
      case Types.ASK_CATEGORIES_JEAN:
        categorys = await Category.find({
          categoryGroupId: Types.JEAN_CATEGORY_ID,
        })
          .select("_id name")
          .limit(8);
        result = { type: Types.ASK_CATEGORIES, data: categorys };
        break;
      case Types.ASK_CATEGORIES_JACKET:
        categorys = await Category.find({
          categoryGroupId: Types.JACKET_CATEGORY_ID,
        })
          .select("_id name")
          .limit(8);
        result = { type: Types.ASK_CATEGORIES, data: categorys };
        break;
      case Types.ASK_LOW_DELIVERY:
        break;
      case Types.ASK_PERSON_BOT_CARE:
        const user = await User.findById(userId);
        result = {
          type: "msg",
          data: `Người tôi quan tâm nhất là ${user.name} vì anh ta tôi sẵn sàng làm mọi thứ!`,
        };
        break;
      case Types.ASK_HOW_TO_BUY:
        result = { type: Types.ASK_HOW_TO_BUY, data: Types.ASK_HOW_TO_BUY };
        break;
      default:
        result = { type: "msg", data: data.data };
        break;
    }
    return result;
  }
  return { type: "msg", data: "Lỗi! Không thể trả lời câu hỏi của bạn!" };
}

module.exports = {
  getMessengers,
  updateMessengerCheck,
  sendMessageToUser,
  sendMessageToBot,
  getMessages,
};
