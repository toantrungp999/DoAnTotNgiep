import React, { Component, memo } from "react";
import { connect } from "react-redux";
import OrderDetailItem from "../../../components/order/OrderDetailItem";
import CancelOrderDialog from "../../../components/order/CancelOrderDialog";
import OrderProgress from "../../../components/order/OrderProgress";
import NotFound from "../notFound/NotFound";
import Loading from "../../../components/common/loading/Loading";
import * as OrderStatuses from "../../../constants/OrderStatuses";
import * as OrderActions from "../../../constants/OrderActions";
import * as OrderTypes from "../../../constants/OrderTypes";
import {
  convertNumberToVND,
  formatDate,
  getStringDate,
} from "./../../../extentions/ArrayEx";

import {
  fetchOrderRequest,
  orderChangeTypeRequest,
  fetchPayRequest,
} from "../../../actions/orderActions";
import {
  UserOutlined,
  PhoneOutlined,
  CompassOutlined,
  CalendarOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import queryString from "query-string";
import { showAlertWithTimeout } from "../../../actions/alertActions";
import "./OrderDetailPage.css";

class OrderDetailPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      serials: [],
      showCancelDialog: false,
    };
  }

  componentDidMount() {
    this.props.fetchOrderRequest(this.props.match.params._id, "");
    let { vnp_ResponseCode } = queryString.parse(this.props.location.search);
    if (vnp_ResponseCode === "00") {
      this.props.showAlertWithTimeout("Thanh toán thành công", "", true);
    }
    if (
      this.props.location.state !== undefined &&
      this.props.location.state.message !== undefined
    ) {
      this.setState({ showAlert: true });
    }
  }

  onCloseCancelDialog = () => {
    this.setState({
      showCancelDialog: false,
    });
  };

  onChangeType = (event) => {
    console.log(event.target.name);
    var name = event.target.name;
    if (name === "pay") {
      this.props.fetchPayRequest(this.props.match.params._id);
    } else if (name === "cancel") {
      this.setState({
        showCancelDialog: true,
      });
    }
  };

  onConfirmCancel = (reason) => {
    var data = { type: OrderActions.CANCEL, description: reason };
    this.props.orderChangeTypeRequest(
      "customer",
      this.props.match.params._id,
      data
    );
    this.setState({
      showCancelDialog: false,
    });
    this.props.fetchOrderRequest(this.props.match.params._id, "");
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.payReducer.vnpUrl) {
      window.open(nextProps.payReducer.vnpUrl, "_self");
    } else return null;
  }

  render() {
    let { loading } = this.props.orderDetailReducer;
    const payLoading = this.props.payReducer.loading;
    if (loading)
      return (
        <div>
          <Loading />
        </div>
      );
    if (this.props.orderDetailReducer.order === null) {
      return (
        <div className="row" style={{ height: "100%" }}>
          <NotFound link={"/orders/"}></NotFound>
        </div>
      );
    }
    var { orderInfo, orderDetails } = this.props.orderDetailReducer.order;

    //cài đặt phần xác nhận hủy đơn hàng
    var confirmCancel;
    if (this.state.showCancelDialog) {
      confirmCancel = (
        <CancelOrderDialog
          isAdminSide={false}
          onCloseCancelDialog={this.onCloseCancelDialog}
          onConfirmCancel={this.onConfirmCancel}
        />
      );
    }
    let dataSerials = [];
    if (orderDetails) {
      for (let i = 0; i < orderDetails.length; i++) {
        let orderDetailId = orderDetails[i]._id;
        let serials = [];
        if (orderDetails[i].serials) {
          const length = orderDetails[i].serials.length;
          for (let j = 0; j < length; j++)
            serials.push(orderDetails[i].serials[j].serial);
        }
        dataSerials.push({ orderDetailId, serials });
      }
    }

    return (
      <div className="order-detail-page">
        {confirmCancel}
        <div className="col-12">
          <div className="row">
            <div className="col-12">
              <div className="row">
                <OrderProgress
                  logs={orderInfo.actionLog}
                  orderType={orderInfo.orderType}
                  paymentType={orderInfo.paymentType}
                  receiveType={orderInfo.receiveType}
                  shipBrand={orderInfo.shipBrand}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="order-detail-info">
          <div className="title">Thông tin khách hàng</div>
          <div className="customer-info-order-type">
            <div className="customer-info">
              <div>
                <UserOutlined /> {orderInfo.customerInfo.name}
              </div>
              <div>
                <PhoneOutlined /> {orderInfo.customerInfo.phoneNumber}
              </div>
              <div>
                <CompassOutlined /> {orderInfo.receiveAddress}
              </div>
            </div>
            <div className="order-type">
              <div>{orderInfo.orderType}</div>
              <div>{orderInfo.paymentType}</div>
              <div>
                {orderInfo.shipBrand !== ""
                  ? orderInfo.shipBrand
                  : orderInfo.receiveType}
              </div>
            </div>
          </div>
        </div>
        {orderInfo.shippingFee !== 0 ? (
          <div className="ship-info">
            <div className="title">Giao hàng</div>
            <div className="ship-brand">{orderInfo.shipBrand}</div>
            <div className="receive-date">
              <InfoCircleOutlined /> Mã vận đơn:{" "}
              <label>{orderInfo.shipOrderId}</label>
            </div>
            <div className="receive-date">
              <CalendarOutlined /> Ngày nhận dự kiến:{" "}
              <label>{getStringDate(orderInfo.expectedReceiveDate)}</label>
            </div>
          </div>
        ) : (
          ""
        )}
        {orderInfo.paymentType === OrderTypes.ONLINE_ORDER.PAYMENT_TYPE.VNPAY &&
        orderInfo.status !== OrderStatuses.PENDING_PAY &&
        orderInfo.paymentId ? (
          <div className="ship-info">
            <div className="title">Thanh toán</div>
            <div className="ship-brand">{orderInfo.paymentType}</div>
            <div className="receive-date">
              <InfoCircleOutlined /> Mã giao dịch:{" "}
              <label>{orderInfo.paymentId}</label>
            </div>
          </div>
        ) : (
          ""
        )}
        <div className="order-detail">
          <div className="top-bar">
            <label className="id">{orderInfo.orderId}</label>
            <label className="date">{formatDate(orderInfo.date)}</label>
            <label className="status">{orderInfo.status}</label>
          </div>
          <div>
            {orderDetails.map((orderDetail, index) => {
              return (
                <OrderDetailItem
                  key={orderDetail._id}
                  orderDetail={orderDetail}
                  showInstore={false}
                ></OrderDetailItem>
              );
            })}
          </div>
          <div className="bottom-section">
            <div className="price-section">
              <div className="total-price">
                Tổng giá: {convertNumberToVND(orderInfo.totalPrice)}₫
              </div>
              <div className="ship">
                {orderInfo.shippingFee !== 0
                  ? "Phí vận chuyển: " +
                    convertNumberToVND(orderInfo.shippingFee) +
                    "đ"
                  : ""}
              </div>
              <div className="">
                <label className="total">
                  Tổng tiền:{" "}
                  <label className="price">
                    {convertNumberToVND(orderInfo.total)}₫
                  </label>
                </label>
              </div>
            </div>
          </div>
          <div className="btn-section">
            {orderInfo.status === OrderStatuses.PENDING_PAY ? (
              <div>
                {payLoading ? (
                  <button className="btn-pay" name="pay">
                    Đang tải...
                  </button>
                ) : (
                  <button
                    className="btn-pay"
                    name="pay"
                    onClick={this.onChangeType}
                  >
                    Thanh toán
                  </button>
                )}
              </div>
            ) : (
              ""
            )}
            {orderInfo.status === OrderStatuses.PENDING_APPROVE ||
            orderInfo.status === OrderStatuses.PENDING_PAY ? (
              <div>
                <button
                  className="btn-cancel"
                  name="cancel"
                  onClick={this.onChangeType}
                >
                  Hủy đơn hàng
                </button>
              </div>
            ) : (
              ""
            )}
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    orderDetailReducer: state.orderDetailReducer,
    payReducer: state.payReducer,
  };
};

const mapDispatchToProps = (dispatch) => ({
  fetchOrderRequest: (_id, all) => {
    dispatch(fetchOrderRequest(_id, all));
  },
  orderChangeTypeRequest: (path, _id, action) => {
    dispatch(orderChangeTypeRequest(path, _id, action));
  },
  fetchPayRequest: (_id) => {
    dispatch(fetchPayRequest(_id));
  },
  showAlertWithTimeout: (message, description, type) => {
    dispatch(showAlertWithTimeout(message, description, type));
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(memo(OrderDetailPage));
