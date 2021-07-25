import React, { Component, memo } from "react";
import { connect } from "react-redux";
import OrderDetailItem from "../../../components/order/OrderDetailItem";
import OrderProgress from "../../../components/order/OrderProgress";
import CancelOrderDialog from "../../../components/order/CancelOrderDialog";
import ConfirmDialog from "../../../components/common/dialogs/ConfirmDialog";
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
} from "../../../actions/orderActions";
import {
  UserOutlined,
  PhoneOutlined,
  CompassOutlined,
  CalendarOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
// sử dụng cùng file OrderDetailPage.css với OrderDetailPage.js (customer OrderDetailPage)

class OrderDetailPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      _id: -1,
      showCancelDialog: false,
      showConfirmDialog: false,
      action: "",
      message: "",
    };
  }

  componentDidMount() {
    const _id = this.props.match.params._id;
    if (_id) {
      this.setState({ _id });
      this.props.fetchOrderRequest(this.props.match.params._id, "/all");
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

  onConfirmCancel = (reason) => {
    var data = { type: OrderActions.CANCEL, description: reason };
    this.props.orderChangeTypeRequest(
      "admin",
      this.props.match.params._id,
      data
    );
    this.setState({
      showCancelDialog: false,
    });
  };

  onConfirm = () => {
    this.props.orderChangeTypeRequest("admin", this.props.match.params._id, {
      type: this.state.type,
    });
    this.setState({
      showConfirmDialog: false,
      type: "",
      message: "",
    });
  };

  onClose = () => {
    this.setState({
      showConfirmDialog: false,
      type: "",
      message: "",
    });
  };

  onChangeType = (event) => {
    const name = event.target.name;
    if (name === "approve") {
      this.setState({
        showConfirmDialog: true,
        type: OrderActions.APPROVE,
        message: "Xác nhận Duyệt đơn hàng",
      });
    } else if (name === "cancel")
      this.setState({
        showCancelDialog: true,
      });
    else if (name === "pass") {
      this.setState({
        showConfirmDialog: true,
        type: OrderActions.PASS,
        message: "Xác nhận Đơn hàng thành công",
      });
    } else if (name === "fail") {
      this.setState({
        showConfirmDialog: true,
        type: OrderActions.FAIL,
        message: "Xác nhận Đơn hàng thất bại",
      });
    }
  };

  render() {
    let { loading } = this.props.orderDetailReducer;
    if (loading)
      return (
        <div>
          <Loading />
        </div>
      );
    const { order } = this.props.orderDetailReducer;
    if (order === null) return <NotFound></NotFound>;
    var { orderInfo, orderDetails } = order;
    //Cài đặt phần thông báo

    //cài đặt phần xác nhận hủy đơn hàng
    var confirm = this.state.showConfirmDialog ? (
      <ConfirmDialog
        message={this.state.message}
        onClose={this.onClose}
        onConfirm={this.onConfirm}
      />
    ) : null;

    var confirmCancel;
    if (this.state.showCancelDialog) {
      confirmCancel = (
        <CancelOrderDialog
          isAdminSide={true}
          onCloseCancelDialog={this.onCloseCancelDialog}
          onConfirmCancel={this.onConfirmCancel}
        />
      );
    }
    return (
      <div className="order-detail-page">
        {confirm}
        {confirmCancel}
        <div className="col-12">
          <div className="row">
            <div className="col-12">
              <div className="row">
                <OrderProgress
                  logs={orderInfo.actionLog}
                  orderType={orderInfo.orderType}
                  paymentType={orderInfo.paymentType}
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
            <div className="title">Thông tin giao hàng</div>
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
        orderInfo.status !== OrderStatuses.PENDING_PAY ? (
          <div className="ship-info">
            <div className="title">Thanh toán</div>
            <div className="ship-brand">{orderInfo.paymentType}</div>
            <div className="receive-date">
              <InfoCircleOutlined /> Mã thanh toán:{" "}
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
                  index={index}
                  orderDetail={orderDetail}
                  showInstore={
                    orderInfo.status === OrderStatuses.PENDING_APPROVE
                  }
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
                <label className="">
                  Tổng tiền:{" "}
                  <label className="price">
                    {convertNumberToVND(orderInfo.total)}₫
                  </label>
                </label>
              </div>
            </div>
          </div>
          <div className="btn-section">
            {orderInfo.status === OrderStatuses.PENDING_APPROVE ? (
              <button
                type="button"
                className="btn-approve"
                name="approve"
                onClick={this.onChangeType}
              >
                Duyệt đơn hàng
              </button>
            ) : (
              ""
            )}
            {orderInfo.status === OrderStatuses.DELIVERING ? (
              <>
                <button
                  type="button"
                  className="btn-pass"
                  name="pass"
                  onClick={this.onChangeType}
                >
                  Xác nhận hoàn thành
                </button>
                <button
                  type="button"
                  className="btn-fail"
                  name="fail"
                  onClick={this.onChangeType}
                >
                  Xác nhận thất bại
                </button>
              </>
            ) : (
              ""
            )}
            {orderInfo.status === OrderStatuses.COMPLETED ? <></> : ""}
            {orderInfo.status === OrderStatuses.PENDING_APPROVE ||
            orderInfo.status === OrderStatuses.PENDING_PAY ? (
              <>
                <button
                  className="btn-cancel"
                  name="cancel"
                  onClick={this.onChangeType}
                >
                  Hủy đơn hàng
                </button>
              </>
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
  };
};

const mapDispatchToProps = (dispatch) => ({
  fetchOrderRequest: (_id, all) => {
    dispatch(fetchOrderRequest(_id, all));
  },
  orderChangeTypeRequest: (path, _id, action) => {
    dispatch(orderChangeTypeRequest(path, _id, action));
  },
  // orderApprove: (_id, data) => { dispatch(orderApproveRequest(_id, data)) },
  // updateSerials: (_id, data) => { dispatch(updateSerialsTypeRequest(_id, data)) },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(memo(OrderDetailPage));
