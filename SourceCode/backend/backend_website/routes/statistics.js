const router = require("express").Router();
const { verifyTokenSuperAdmin } = require("./../middleware/verifyToken");
const Order = require("../models/Order");
const OrderDetail = require("../models/OrderDetail");
const STATUS = require("../constants/ResponseStatus");
const OrderStatus = require("../constants/OrderStatus");
const Respones = require("../models/Respones");
const { date } = require("@hapi/joi");

router.get("/", verifyTokenSuperAdmin, async (req, res) => {
  try {
    const { statisticsType, orderType, start, end } = req.query;
    let startDate = start.replace("--", "+");
    let endDate = end.replace("--", "+");
    startDate = new Date(startDate);
    endDate = new Date(endDate);

    let condition = [];
    condition.push({ status: OrderStatus.COMPLETED });
    if (orderType !== "all") {
      condition.push({ orderType: orderType });
    }
    condition.push({ date: { $gte: startDate, $lte: endDate } });
    const orders = await Order.find({ $and: condition }).sort({ date: "1" });
    let revenue = null;
    let sales = null;
    if (statisticsType === "revenue") {
      revenue = [];
      let j = 0;
      let sum = 0;
      for (var i = 0; i < orders.length; ) {
        if (
          Date.parse(orders[i].date.toISOString()) >=
            Date.parse(startDate.toISOString()) + j * 86400000 &&
          Date.parse(orders[i].date.toISOString()) <
            Date.parse(startDate.toISOString()) + (j + 1) * 86400000
        ) {
          sum += orders[i].totalPrice;
          i++;
        } else {
          revenue.push({
            date: new Date(Date.parse(startDate.toISOString()) + j * 86400000),
            sum: sum,
          });
          sum = 0;
          j++;
        }
        if (i == orders.length) {
          revenue.push({
            date: new Date(Date.parse(startDate.toISOString()) + j * 86400000),
            sum: sum,
          });
          sum = 0;
        }
      }
    } else {
      sales = {};
      let orderIds = [];
      for (var i = 0; i < orders.length; i++) {
        orderIds.push({ orderId: orders[i]._id });
      }
      let orderDetails = await OrderDetail.find({ $or: orderIds }).populate({
        path: "quantityId",
        populate: { path: "productId", select: ["name"] },
      });
      for (var i = 0; i < orderDetails.length; i++) {
        const name = orderDetails[i].quantityId.productId.name;
        if (sales[name]) {
          sales[name].quantity += orderDetails[i].quantity;
          sales[name].total += orderDetails[i].price * orderDetails[i].quantity;
        } else {
          sales[name] = {
            quantity: orderDetails[i].quantity,
            total: orderDetails[i].price * orderDetails[i].quantity,
          };
        }
      }
    }

    res.send(new Respones(0, { revenue: revenue, sales: sales }));
  } catch (error) {
    console.log(error);
    res.send(new Respones(STATUS.UNKNOWN_EEROR, null, error.message));
  }
});

module.exports = router;
