const router = require("express").Router();
const mongoose = require("mongoose");
const { verify, verifyTokenAdmin } = require("./../middleware/verifyToken");
const {
  approveOrderValidation,
  updateSerialValidation,
} = require("../validation/orderValidation");
const User = require("../models/User");
const Brand = require("../models/Brand");
const QuantityOption = require("../models/QuantityOption");
const Order = require("../models/Order");
const OrderDetail = require("../models/OrderDetail");
const Cart = require("../models/Cart");
const OrderStatus = require("../constants/OrderStatus");
const OrderActions = require("../constants/OrderAction");
const {
  GHNshippingFee,
  GHNcreateOrder,
} = require("../services/deliveryService");
const OrderTypes = require("../constants/OrderType");
const storeAddresses = require("../resources/storeLocation.json");
const sendMail = require("./../services/SendMail");
const Notification = require("../models/Notification");
const {
  ORDERED,
  APPROVAL,
  CANCELED_ORDER,
} = require("../constants/NotificationAction");
const { findIndexById } = require("../services/Extention");
const STATUS = require("../constants/ResponseStatus");
const Respones = require("../models/Respones");
const Product = require("../models/Product");
const { sortObject, createVNPayUrl } = require("../services/paymentService");

router.get("", verify, async (req, res) => {
  try {
    const status = req.query.status;
    const search = req.query.search;
    const page = Number(req.query.page);
    const pageSize = 5;
    var orderInfos;
    if (status == "Tất cả")
      orderInfos = await Order.find({ userId: req.user._id });
    else
      orderInfos = await Order.find({ userId: req.user._id, status: status });

    let conditions = [];

    for (const i in orderInfos) {
      conditions.push({ orderId: orderInfos[i]._id });
    }
    const orderDetails = await OrderDetail.find({
      $and: [{ $or: conditions }, { name: { $regex: search, $options: "i" } }],
    });

    conditions = [];
    let orderIds = [];
    for (const i in orderDetails) {
      if (!orderIds.includes(orderDetails[i].orderId)) {
        orderIds.push(orderDetails[i].orderId);
        conditions.push({ _id: orderDetails[i].orderId });
      }
    }
    conditions.push(
      { "customerInfo.name": { $regex: search, $options: "i" } },
      { "customerInfo.phoneNumber": { $regex: search, $options: "i" } },
      { orderId: { $regex: search, $options: "i" } }
    );
    if (status == "Tất cả")
      conditions = { $and: [{ $or: conditions }, { userId: req.user._id }] };
    else
      conditions = {
        $and: [
          { $or: conditions },
          { userId: req.user._id },
          { status: status },
        ],
      };

    orderInfos = await Order.find(conditions)
      .skip(pageSize * (page - 1))
      .limit(pageSize)
      .sort({ date: "-1" });
    const count = await Order.countDocuments(conditions);

    let orders = [];
    for (const i in orderInfos) {
      const orderDetails = await OrderDetail.find({
        orderId: orderInfos[i]._id,
      });
      orders.push({
        orderInfo: orderInfos[i],
        orderDetails,
      });
    }
    res.send(
      new Respones(0, {
        orders: orders,
        pageInfo: {
          totalPage: Math.round(count / pageSize + 0.49),
          currentPage: page,
          pageSize: pageSize,
        },
        currentStatus: req.query.status,
        currentSearch: req.query.search,
      })
    );
  } catch (error) {
    console.log(error.message);
    res.send(new Respones(STATUS.UNKNOWN_EEROR, null, error.message));
  }
});

router.get("/all", verifyTokenAdmin, async (req, res) => {
  try {
    const status = req.query.status;
    const search = req.query.search;
    const page = Number(req.query.page);
    const pageSize = 5;
    var orderInfos;

    if (status == "Tất cả") orderInfos = await Order.find({});
    else orderInfos = await Order.find({ status: status });

    let conditions = [];

    for (const i in orderInfos) {
      conditions.push({ orderId: orderInfos[i]._id });
    }
    const orderDetails = await OrderDetail.find({
      $and: [{ $or: conditions }, { name: { $regex: search, $options: "i" } }],
    });

    conditions = [];
    let orderIds = [];
    for (const i in orderDetails) {
      if (!orderIds.includes(orderDetails[i].orderId)) {
        orderIds.push(orderDetails[i].orderId);
        conditions.push({ _id: orderDetails[i].orderId });
      }
    }
    conditions.push(
      { "customerInfo.name": { $regex: search, $options: "i" } },
      { "customerInfo.phoneNumber": { $regex: search, $options: "i" } },
      { orderId: { $regex: search, $options: "i" } }
    );
    if (status == "Tất cả") conditions = { $and: [{ $or: conditions }] };
    else conditions = { $and: [{ $or: conditions }, { status: status }] };

    orderInfos = await Order.find(conditions)
      .skip(pageSize * (page - 1))
      .limit(pageSize)
      .sort({ date: "-1" });
    const count = await Order.countDocuments(conditions);

    let orders = [];
    for (const i in orderInfos) {
      const orderDetails = await OrderDetail.find({
        orderId: orderInfos[i]._id,
      });
      orders.push({
        orderInfo: orderInfos[i],
        orderDetails,
      });
    }
    res.send(
      new Respones(0, {
        orders: orders,
        pageInfo: {
          totalPage: Math.round(count / pageSize + 0.49),
          currentPage: page,
          pageSize: pageSize,
        },
        currentStatus: req.query.status,
        currentSearch: req.query.search,
      })
    );
  } catch (error) {
    res.send(new Respones(STATUS.UNKNOWN_EEROR, null, error.message));
  }
});

router.get("/:_id", verify, async (req, res) => {
  try {
    const orderInfo = await Order.findById(req.params._id);
    if (!orderInfo)
      return res.send(new Respones(-1, null, "Không tìm thấy đơn hàng"));
    if (orderInfo.userId != req.user._id)
      return res.send(
        new Respones(STATUS.ERROR_PERMISSIONS, null, "Không có quyền truy cập")
      );
    const orderDetails = await OrderDetail.find({ orderId: orderInfo._id });
    let paymentInfoUrl = null;
    if (
      orderInfo.paymentType === OrderTypes.ONLINE_ORDER.PAYMENT_TYPE.VNPAY &&
      orderInfo.status !== OrderStatus.PENDING_PAY
    ) {
      const url = createVNPayUrl(orderInfo.paymentId, "refund", req, orderInfo);
      paymentInfoUrl = url.vnpUrl;
    }
    res.send(
      new Respones(0, {
        orderInfo,
        orderDetails,
        paymentInfoUrl,
      })
    );
  } catch (error) {
    console.log(error);
    if (error instanceof mongoose.Error.CastError) {
      res.send(new Respones(0));
    } else {
      res.send(new Respones(STATUS.UNKNOWN_EEROR, null, error.message));
    }
  }
});

router.get("/all/:_id", verifyTokenAdmin, async (req, res) => {
  try {
    const orderInfo = await Order.findById(req.params._id);
    if (!orderInfo)
      return res.send(new Respones(-1, null, "Không tìm thấy đơn hàng"));
    const orderDetails = await OrderDetail.find({
      orderId: orderInfo._id,
    }).populate("quantityId", "quantity");
    res.send(
      new Respones(0, {
        orderInfo,
        orderDetails,
      })
    );
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      res.send(new Respones(0));
    } else {
      res.send(new Respones(STATUS.UNKNOWN_EEROR, null, error.message));
    }
  }
});

router.post("/create/fetchCart", verify, async (req, res) => {
  try {
    const cartIdList = req.body.cartIdList;
    let carts = [];
    for (let index = cartIdList.length - 1; index >= 0; index--) {
      const cart = await Cart.findById({ _id: cartIdList[index] })
        .populate({
          path: "colorId",
          select: ["color", "image", "productId"],
        })
        .populate({
          path: "colorId",
          populate: { path: "productId", select: ["name", "price", "saleOff"] },
        })
        .populate({
          path: "sizeId",
          select: ["size"],
        });
      if (cart) {
        carts.push(cart);
      }
    }
    if (carts.length > 0) res.send(new Respones(0, carts));
    else throw new Error("Không lấy được dữ liệu, chưa chọn sản phẩm");
  } catch (error) {
    res.send(new Respones(STATUS.UNKNOWN_EEROR, null, error.message));
  }
});

router.post("/online", verify, async (req, res) => {
  createOrder(req, res);
});

router.post("/instore", verifyTokenAdmin, async (req, res) => {
  createOrder(req, res);
});

async function createOrder(req, res) {
  //body : addressId, storeAddressId, optionList, orderType, paymentType, receiveType, userInfo, shipInfo
  let session = await mongoose.startSession();
  session.startTransaction();
  try {
    var user = await User.findById(req.user._id).session(session);
    //console.log("user", user);
    const order = new Order({
      orderId: "",
      userId: req.user._id,
      staffName: "",
      customerInfo: {
        name: "",
        phoneNumber: "",
      },
      orderType: "",
      paymentType: "",
      paymentId: "",
      receiveType: "",
      receiveAddress: "",
      shipOrderId: "",
      shipBrand: "",
      expectedReceiveDate: "",
      shippingFee: 0,
      totalPrice: "0",
      total: "0",
      status: OrderStatus.PENDING_APPROVE,
      actionLog: [],
    });
    order.orderId = String(order._id).slice(0, 8).toUpperCase();
    order.actionLog.push({
      action: OrderActions.CREATE,
    });

    var totalPrice = 0;
    var totalQuantity = 0;
    var options = req.body.optionList;
    if (options == undefined || options == null || options.length == 0)
      throw new Error("Chưa chọn sản phẩm");
    for (const index in options) {
      const quantityOption = await QuantityOption.findOne({
        colorId: options[index].colorId,
        sizeId: options[index].sizeId,
      })
        .populate({
          path: "productId",
          select: ["name", "brandID", "price", "saleOff"],
        })
        .populate({ path: "sizeId", select: ["size"] })
        .populate({ path: "colorId", select: ["color", "image"] })
        .session(session);
      if (quantityOption.quantity < options[index].quantity)
        throw new Error(
          `${quantityOption.productId.name} số lượng còn lại không đủ, vui lòng thử lại sau`
        );
      //console.log("priceOptionId", options[index]._id);
      //console.log("priceOption", priceOption);
      const brand = await Brand.findById(
        quantityOption.productId.brandId
      ).session(session);
      const price =
        quantityOption.productId.price - quantityOption.productId.saleOff;
      // console.log("PRICE", price);
      const orderDetail = new OrderDetail({
        orderId: order._id,
        name: quantityOption.productId.name,
        brand: brand ? brand.name : "No Brand",
        size: quantityOption.sizeId.size,
        color: quantityOption.colorId.color,
        image: quantityOption.colorId.image,
        price: price,
        quantity: options[index].quantity,
        quantityId: quantityOption._id,
      });
      totalPrice += orderDetail.price * orderDetail.quantity;
      totalQuantity += options[index].quantity;
      await Cart.deleteOne({
        user: req.user._id,
        colorId: options[index].colorId,
        sizeId: options[index].sizeId,
      }).session(session);
      await orderDetail.save({ session });
    }

    //Gây lỗi
    const orderType = req.body.orderType;
    const paymentType = req.body.paymentType;
    const receiveType = req.body.receiveType;
    const userInfo = req.body.userInfo;
    order.orderType = orderType;
    order.paymentType = paymentType;
    order.receiveType = receiveType;

    //phương thức đặt hàng (đăt hàng online)
    if (orderType == OrderTypes.ONLINE_ORDER.ORDER_TYPE) {
      order.orderType = orderType;

      // set userInfo cho hình thức đặt hàng online
      order.customerInfo.name = userInfo.name;
      order.customerInfo.phoneNumber = userInfo.phoneNumber;

      // phương thức thanh toán
      if (paymentType == OrderTypes.ONLINE_ORDER.PAYMENT_TYPE.VNPAY) {
        order.paymentType = paymentType;
        order.status = OrderStatus.PENDING_PAY;
      } else if (paymentType == OrderTypes.ONLINE_ORDER.PAYMENT_TYPE.OFFLINE) {
        order.paymentType = paymentType;
        order.status = OrderStatus.PENDING_APPROVE;
      } else {
        throw new Error("Chưa chọn phương thức thanh toán");
      }

      // phương thức nhận hàng ( ship)
      if (receiveType == OrderTypes.ONLINE_ORDER.RECEIVE_TYPE.SHIP) {
        order.paymentType = paymentType;
        var shippingFee = 0;
        const shipInfo = req.body.shipInfo;
        const address = req.body.address;
        shipOrderInfo = await GHNcreateOrder(
          userInfo.name,
          userInfo.phoneNumber,
          address,
          totalQuantity,
          shipInfo.serviceTypeId,
          shipInfo.serviceId,
          totalPrice
        );
        order.receiveAddress =
          address.streetOrBuilding +
          ", " +
          address.ward +
          ", " +
          address.district +
          ", " +
          address.city;
        if (shipOrderInfo !== null) {
          order.shippingFee = Number(shipOrderInfo.shippingFee);
          order.shipOrderId = shipOrderInfo.shipOrderId;
          order.expectedReceiveDate = shipOrderInfo.expectedReceiveDate;
          order.shipBrand = shipInfo.name;
        } else {
          throw new Error(
            "Liên kết với đơn vị giao hàng thất bại - Vui lòng sử dụng số điện thoại thật để đảm bảo tính chính xác"
          );
        }
      }
      // phương thức nhận hàng ( nhận tại của hàng)
      else if (receiveType == OrderTypes.ONLINE_ORDER.RECEIVE_TYPE.IN_STORE) {
        const address = req.body.address;
        order.receiveAddress =
          address.streetOrBuilding +
          ", " +
          address.ward +
          ", " +
          address.district +
          ", " +
          address.city;
        order.shippingFee = 0;
      } else {
        throw new Error("Chưa chọn phương thức thanh toán");
      }
    }
    //phương thức đặt hàng (nhân viên đặt hàng tại của hàng)
    else if (orderType == OrderTypes.IN_STORE_ORDER.ORDER_TYPE) {
      order.orderType = orderType;

      //set staffName và userInfo cho hình thức đặt hàng tại của hàng

      order.staffName = user.name;
      order.customerInfo.name = userInfo.name;
      order.customerInfo.phoneNumber = userInfo.phoneNumber;

      // phương thức thanh toán
      if (paymentType == OrderTypes.IN_STORE_ORDER.PAYMENT_TYPE.CASH) {
        order.paymentType = paymentType;
        order.status = OrderStatus.PENDING_APPROVE;
      } else if (paymentType == OrderTypes.IN_STORE_ORDER.PAYMENT_TYPE.VNPAY) {
        order.paymentType = paymentType;
        order.status = OrderStatus.PENDING_PAY;
      } else {
        throw new Error("Chưa chọn phương thức thanh toán");
      }

      // phương thức nhận hàng (nhận tại của hàng)
      if (receiveType == OrderTypes.IN_STORE_ORDER.RECEIVE_TYPE.IN_STORE) {
        //set receiveAddress cho đơn hàng nhận tại của hàng
        const address = req.body.address;
        order.receiveAddress =
          address.streetOrBuilding +
          ", " +
          address.ward +
          ", " +
          address.district +
          ", " +
          address.city;
        order.shippingFee = 0;
      } else {
        throw new Error("Chưa chọn phương thức thanh toán");
      }
    } else {
      throw new Error("Chưa chọn hình thức đặt hàng");
    }
    //console.log("order", order);
    // const orderSaved = await order.save({ session });

    order.totalPrice = totalPrice;
    order.total = order.totalPrice + Number(order.shippingFee);
    await order.save({ session });
    sendMail(
      "Đặt hàng thành công",
      user.email,
      "<span>Bạn đã đặt hành thành công, đơn hàng của bạn là " +
        order.orderId +
        " </span>"
    );
    await session.commitTransaction();
    const notification = new Notification({
      user: null,
      target: { order: order._id },
      performedBy: req.user._id,
      action: ORDERED,
    });
    await notification.save();
    return res.send(
      new Respones(0, {
        orderInfo: {
          _id: order._id,
          status: order.status,
        },
      })
    );
  } catch (error) {
    await session.abortTransaction();
    return res.send(new Respones(STATUS.UNKNOWN_EEROR, null, error.message));
  } finally {
    session.endSession();
  }
}

// dataSerials: [{orderDetailId, serials: []}]
// router.put('/approve/:_id', verifyTokenAdmin, async (req, res) => {
//     const { error } = approveOrderValidation(req.body);
//     if (error)
//         return res.status(303).send({ message: error.details[0].message, dulicationIndexs: [] });
//     let session = await mongoose.startSession();
//     await session.startTransaction();
//     let dulicationIndexs = [];
//     try {
//         let order = await Order.findById(req.params._id).populate({ path: 'userId', select: ['email'] }).session(session);
//         let orderDetails = await OrderDetail.find({ orderId: req.params._id }).session(session);

//         if (!order)
//             throw new Error("Không tìm thấy đơn hàng");//đã kt ở giao diện, nên chỉ thông báo
//         if (!order.userId)
//             throw new Error("Không tìm thấy thông tin khách hàng");//đã kt ở giao diện, nên chỉ thông báo

//         order.actionLog.push({
//             action: OrderActions.APPROVE
//         })
//         await order.save();
//         if (order.status == OrderStatus.PENDING_APPROVE) {
//             for (let index in orderDetails) {
//                 let quantityOption = await QuantityOption.findById(orderDetails[index].quantityId).session(session);
//                 if (quantityOption.quantity >= orderDetails[index].quantity) {
//                     quantity.quantity -= orderDetails[index].quantity;
//                     await quantityOption.save();
//                 } else
//                     throw new Error("Duyệt đơn hàng thất bại, số lượng không đủ");//đã kt ở giao diện, nên chỉ thông báo
//             }
//             await Order.updateOne({ _id: req.params._id }, {
//                 $set: {
//                     status: OrderStatus.DELIVERING
//                 }
//             }).session(session);
//             const emailTitle = "Đơn hàng đã được duyệt";
//             const emailContent = "Đơn hàng " + order.orderId + " của bạn đã được duyệt"

//             const notification = new Notification({
//                 user: order.userId._id,
//                 target: { order: order._id },
//                 performedBy: req.user._id,
//                 action: APPROVAL
//             });
//             await notification.save();
//             sendMail(emailTitle, order.userId.email, emailContent);
//             return res.send(new Respones(0, { status: OrderStatus.DELIVERING }));
//             // return res.json({
//             //     message: 'Duyệt đơn hàng thành công',
//             //     status: OrderStatus.DELIVERING
//             // });
//         } else
//             throw new Error("Duyệt đơn hàng thất bại");
//     } catch (error) {
//         if (session.inTransaction())
//             await session.abortTransaction();
//         //return res.status(303).send({ message: err.message, dulicationIndexs });
//         return res.send(new Respones(STATUS.UNKNOWN_EEROR, { dulicationIndexs }, error.message));
//     } finally {
//         if (session.inTransaction())
//             await session.commitTransaction();
//         session.endSession();
//     }
// });

router.put("/admin/:_id", verifyTokenAdmin, async (req, res) => {
  const type = req.body.type;
  if (
    type === OrderActions.CANCEL ||
    type === OrderActions.PASS ||
    type === OrderActions.FAIL ||
    type === OrderActions.APPROVE
  ) {
    changeType(req, res);
  } else {
    return res.send(
      new Respones(STATUS.UNKNOWN_EEROR, null, "Thao tác thất bại")
    );
  }
});

router.put("/customer/:_id", verify, async (req, res) => {
  const type = req.body.type;
  if (type === OrderActions.PAY || type === OrderActions.CANCEL) {
    changeType(req, res);
  } else {
    return res.send(
      new Respones(STATUS.UNKNOWN_EEROR, null, "Thao tác thất bại")
    );
  }
});

async function changeType(req, res) {
  //thêm description
  let session = await mongoose.startSession();
  session.startTransaction();
  let description = req.body.description;
  const type = req.body.type;

  let emailContent = "";
  let emailTitle = "";
  let user = {};

  try {
    if (type !== OrderActions.CANCEL) {
      description = "";
    } else if (
      description == undefined ||
      description == null ||
      description.length < 0 ||
      description.length > 500
    ) {
      throw new Error("Thao tác thất bại");
    }
    let order = await Order.findById(req.params._id).session(session);
    if (!order) throw new Error("Không tìm thấy đơn hàng");

    user = await User.findById(order.userId, "email").session(session);
    if (!user) throw new Error("Không tìm thấy thông tin khách hàng");

    order.actionLog.push({
      action: type,
      description: description,
    });
    await order.save();

    if (type == OrderActions.PAY) {
      if (order.userId != req.user._id)
        return res.send(new Respones(-1, null, "Thanh toán thất bại"));
      if (
        order.status == OrderStatus.PENDING_PAY &&
        order.paymentType == OrderTypes.ONLINE_ORDER.PAYMENT_TYPE.ONLINE
      ) {
        await Order.updateOne(
          { _id: req.params._id },
          {
            $set: {
              status: OrderStatus.PENDING_APPROVE,
            },
          }
        ).session(session);
        emailTitle = "Đơn hàng đã thanh toán";
        emailContent =
          "Đơn hàng " +
          order.orderId +
          " của bạn đã được thanh toán thành công";
        return res.send(new Respones(0, null, "Thanh toán thành công"));
      } else {
        throw new Error("Thanh toán thất bại");
      }
    } else if (type === OrderActions.APPROVE) {
      if (order.status == OrderStatus.PENDING_APPROVE) {
        const orderDetails = await OrderDetail.find({
          orderId: order._id,
        }).session(session);
        for (let index in orderDetails) {
          let quantityOption = await QuantityOption.findById(
            orderDetails[index].quantityId
          )
            .populate("productId", "name")
            .session(session);
          if (quantityOption.quantity >= orderDetails[index].quantity) {
            quantityOption.quantity -= orderDetails[index].quantity;
            await quantityOption.save();
            let product = await Product.findById(
              quantityOption.productId
            ).session(session);
            product.numberBuy += orderDetails[index].quantity;
            await product.save();
          } else
            throw new Error(
              `Duyệt đơn hàng thất bại, số lượng không đủ - ${quantityOption.productId.name}`
            ); //đã kt ở giao diện, nên chỉ thông báo
        }
        await Order.updateOne(
          { _id: req.params._id },
          {
            $set: {
              status: OrderStatus.DELIVERING,
            },
          }
        ).session(session);
        emailTitle = "Đơn hàng đã được duyệt";
        emailContent = "Đơn hàng " + order.orderId + " của bạn đã được duyệt";

        const notification = new Notification({
          user: order.userId._id,
          target: { order: order._id },
          performedBy: req.user._id,
          action: APPROVAL,
        });
        await notification.save();
        sendMail(emailTitle, order.userId.email, emailContent);
        return res.send(
          new Respones(0, {
            status: OrderStatus.DELIVERING,
            actionLog: order.actionLog,
          })
        );
        // return res.json({
        //     message: 'Duyệt đơn hàng thành công',
        //     status: OrderStatus.DELIVERING
        // });
      } else throw new Error("Duyệt đơn hàng thất bại");
    } else if (req.body.type == OrderActions.PASS) {
      if (order.status == OrderStatus.DELIVERING) {
        await Order.updateOne(
          { _id: req.params._id },
          {
            $set: {
              status: OrderStatus.COMPLETED,
            },
          }
        ).session(session);
        emailTitle = "Đơn hàng đã hoàn thành";
        emailContent =
          "Đơn hàng " + order.orderId + " của bạn đã được giao thành công";
        return res.send(
          new Respones(
            0,
            { status: OrderStatus.COMPLETED, actionLog: order.actionLog },
            "Đã xác nhận giao hàng thành công"
          )
        );
      } else {
        throw new Error("Thao tác xác nhận thất bại");
      }
    } else if (type === OrderActions.FAIL) {
      const orderDetails = await OrderDetail.find({
        orderId: order._id,
      }).session(session);
      for (let index in orderDetails) {
        let quantityOption = await QuantityOption.findById(
          orderDetails[index].quantityId
        ).session(session);
        quantityOption.quantity += orderDetails[index].quantity;
        await quantityOption.save();
      }
      if (order.status == OrderStatus.DELIVERING) {
        await Order.updateOne(
          { _id: req.params._id },
          {
            $set: {
              status: OrderStatus.FAILED,
            },
          }
        ).session(session);
        emailTitle = "Giao hàng thất bại";
        emailContent =
          "Đơn hàng " +
          order.orderId +
          " của bạn đã đã bị hủy do giao hàng không thành công";
        return res.send(
          new Respones(
            0,
            { status: OrderStatus.FAILED, actionLog: order.actionLog },
            "Đã xác nhận giao hàng thất bại"
          )
        );
      } else {
        throw new Error("Thao tác xác nhận thất bại");
      }
    } else if (type === OrderActions.CANCEL) {
      if (
        order.status == OrderStatus.PENDING_PAY ||
        order.status == OrderStatus.PENDING_APPROVE
      ) {
        await Order.updateOne(
          { _id: req.params._id },
          {
            $set: {
              status: OrderStatus.CANCELED,
            },
          }
        ).session(session);
        emailTitle = "Đơn hàng đã hủy";
        emailContent = "Đơn hàng " + order.orderId + " của bạn đã bị hủy";
        const notification = new Notification({
          user: user._id,
          target: { order: order._id },
          performedBy: req.user._id,
          action: CANCELED_ORDER,
        });
        await notification.save();
        return res.send(
          new Respones(
            0,
            { status: OrderStatus.CANCELED, actionLog: order.actionLog },
            "Hủy đơn hàng thành công"
          )
        );
      } else {
        throw new Error("Hủy đơn hàng thất bại");
      }
    } else {
      throw new Error("Thao tát thất bại");
    }
  } catch (error) {
    console.log(error);
    user = null;
    if (session.inTransaction()) await session.abortTransaction();
    return res.send(new Respones(STATUS.UNKNOWN_EEROR, null, error.message));
  } finally {
    if (session.inTransaction()) {
      await session.commitTransaction();
      if (user !== null) {
        sendMail(emailTitle, user.email, `<span>${emailContent}</span>`);
      }
    }
    session.endSession();
  }
}

router.post("/shippingfee", verify, async (req, res) => {
  try {
    const address = req.body;
    // const { city, district, ward, streetOrBuilding } = address;
    // const address = { city, district, ward, streetOrBuilding };
    // console.log(address);
    const shippingFees = await GHNshippingFee(address);
    return res.send(new Respones(0, { shippingFees }));
  } catch (error) {
    console.log(error);
    res.send(new Respones(STATUS.UNKNOWN_EEROR, null, error.message));
  }
});

router.get("/payment/vnpay_url/:id", verify, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (
      order.paymentType !== OrderTypes.ONLINE_ORDER.PAYMENT_TYPE.VNPAY ||
      order.status !== OrderStatus.PENDING_PAY
    )
      return res.send(new Respones(0, {}));

    const url = createVNPayUrl(null, "pay", req, order);

    await Order.updateOne(
      { _id: req.params.id },
      {
        $set: {
          paymentId: url.paymentId,
        },
      }
    );

    return res.send(new Respones(0, { vnpUrl: url.vnpUrl }));
  } catch (error) {
    console.log(error);
    res.send(new Respones(STATUS.UNKNOWN_EEROR, null, error.message));
  }
});

router.get("/payment/vnpay_ipn", async (req, res) => {
  try {
    var vnp_Params = req.query;
    var secureHash = vnp_Params["vnp_SecureHash"];

    delete vnp_Params["vnp_SecureHash"];
    delete vnp_Params["vnp_SecureHashType"];

    vnp_Params = sortObject(vnp_Params);
    var secretKey = process.env.VNP_HASHSECRET;
    var querystring = require("qs");
    var signData =
      secretKey + querystring.stringify(vnp_Params, { encode: false });

    var sha256 = require("sha256");

    var checkSum = sha256(signData);

    if (secureHash === checkSum) {
      var paymentId = vnp_Params["vnp_TxnRef"];
      var rspCode = vnp_Params["vnp_ResponseCode"];
      if (rspCode === "00") {
        var order = await Order.findOne({ paymentId: paymentId }).populate({
          path: "userId",
          select: ["email"],
        });
        if (
          order.paymentType !== OrderTypes.ONLINE_ORDER.PAYMENT_TYPE.VNPAY ||
          order.status !== OrderStatus.PENDING_PAY
        )
          return res
            .status(200)
            .json({ RspCode: "97", Message: "Fail checksum" });
        order.actionLog.push({
          action: OrderActions.PAY,
          description: "Cổng VNPAY",
        });
        order.status = OrderStatus.PENDING_APPROVE;
        sendMail(
          "Thanh toán thành công",
          order.userId.email,
          `<span>Đơn hàng ${order.orderId} của bạn đã được thanh toán thành công trên cổng dịch vụ VNPAY</span>`
        );
        await order.save();
        return res.status(200).json({ RspCode: "00", Message: "success" });
      }
      return res.status(200).json({ RspCode: "97", Message: "Fail checksum" });
    } else {
      return res.status(200).json({ RspCode: "97", Message: "Fail checksum" });
    }
  } catch (error) {
    return res.status(200).json({ RspCode: "97", Message: error.message });
  }
});

module.exports = router;
