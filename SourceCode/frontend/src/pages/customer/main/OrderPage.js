import React, { Component, memo } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import OrderDetailItem from "../../../components/order/OrderDetailItem";
import OrderSearchByStatus from "../../../components/order/OrderSearchByStatus";
import { convertNumberToVND, formatDate } from "./../../../extentions/ArrayEx";
import { fetchOrdersRequest } from "../../../actions/orderActions";
import queryString from "query-string";
import Paging from "../../../components/common/paging/Paging";
import Loading from "../../../components/common/loading/Loading";
import "./OrderPage.css";

class OrderPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      search: "",
    };
  }

  componentDidMount() {
    const values = queryString.parse(this.props.location.search);
    var { status, search, page } = values;
    if (status === undefined || status === null) status = "Tất cả";
    if (search === undefined || search === null) search = "";
    if (page === undefined || page === null) page = "1";
    this.setState({ search: search });

    this.props.fetchOrdersRequest("", status, search, page);
  }

  onFetchData = (nextPage) => {
    const values = queryString.parse(this.props.location.search);
    var { status, search } = values;
    if (status === undefined || status === null) status = "Tất cả";
    if (search === undefined || search === null) search = "";
    let nextSearch = `?status=${status}&search=${search}&page=${nextPage}`;

    this.props.history.push({
      pathname: "/orders",
      search: nextSearch,
      state: undefined,
    });
    this.props.fetchOrdersRequest("", status, search, nextPage);
  };

  onSwitchStatus = (nextStatus) => {
    const values = queryString.parse(this.props.location.search);
    var { search } = values;
    if (search === undefined || search === null) search = "";
    let nextSearch = `?status=${nextStatus}&search=${search}&page=1`;
    this.props.history.push({
      pathname: "/orders",
      search: nextSearch,
      state: undefined,
    });
    this.props.fetchOrdersRequest("", nextStatus, search, "1");
  };

  onSearch = () => {
    const values = queryString.parse(this.props.location.search);
    var { status } = values;
    if (status === undefined || status === null) status = "Tất cả";
    let search = `?status=${status}&search=${this.state.search}&page=1`;
    this.props.history.push({
      pathname: "/orders",
      search: search,
      state: undefined,
    });
    this.props.fetchOrdersRequest("", status, this.state.search, "1");
  };

  onChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  onKeyPress = (event) => {
    if (event.key === "Enter") {
      this.onSearch();
    }
  };

  render() {
    let { loading, pageInfo, currentStatus } = this.props.orderReducer;
    if (loading)
      return (
        <div className="order-page">
          <div className="order-container">
            <div className="">
              <OrderSearchByStatus
                currentStatus={currentStatus}
                onSwitchStatus={this.onSwitchStatus}
              />
            </div>
            <div className="order-search-bar">
              <i className="fas fa-search"></i>
              <input
                name="search"
                placeholder="Tìm kiếm theo Mã đơn hàng, Tên khách hàng hoặc Tên sản phẩm"
                value={this.state.search}
                onChange={this.onChange}
                onKeyPress={this.onKeyPress}
              ></input>
            </div>
            <div className="">
              <Loading />
            </div>
            <div>
              <Paging
                onFetchData={this.onFetchData}
                pagingInfo={pageInfo}
                loading={loading}
                location={this.props.location}
              />
            </div>
          </div>
        </div>
      );
    var orders = this.props.orderReducer.orders;
    let orderList =
      orders && orders.length > 0 ? (
        orders.map((order) => {
          return (
            <div
              key={order.orderInfo._id}
              className="order-page-item"
              style={{ backgroundColor: "#FFFFFF" }}
            >
              <div className="top-bar">
                <label className="id">{order.orderInfo.orderId}</label>
                <label className="date">
                  {formatDate(order.orderInfo.date)}
                </label>
                <label className="status">{order.orderInfo.status}</label>
              </div>
              <div>
                {order.orderDetails.map((orderDetail) => {
                  return (
                    <OrderDetailItem
                      key={orderDetail._id}
                      orderDetail={orderDetail}
                    ></OrderDetailItem>
                  );
                })}
              </div>
              <div className="bottom-section">
                <div className="info">
                  <div className="">
                    <label>{order.orderInfo.orderType}</label>
                  </div>
                  <div className="">
                    <label>{order.orderInfo.paymentType}</label>
                  </div>
                  <div className="">
                    <label>
                      {order.orderInfo.shipBrand !== ""
                        ? order.orderInfo.shipBrand
                        : order.orderInfo.receiveType}
                    </label>
                  </div>
                </div>
                <div className="price-section">
                  <div className="total-price">
                    Tổng giá: {convertNumberToVND(order.orderInfo.totalPrice)}₫
                  </div>
                  <div className="ship">
                    {order.orderInfo.shippingFee !== 0
                      ? "Phí vận chuyển: " +
                        convertNumberToVND(order.orderInfo.shippingFee) +
                        "đ"
                      : ""}
                  </div>
                  <div className="">
                    <label className="total">
                      Tổng tiền:{" "}
                      <label className="price">
                        {convertNumberToVND(order.orderInfo.total)}₫
                      </label>
                    </label>
                  </div>
                  <div className="">
                    <Link className="" to={`/orders/${order.orderInfo._id}`}>
                      <button className="btn-detail">Xem chi tiết</button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          );
        })
      ) : (
        <div className="no-data">Không tìm thấy đơn hàng</div>
      );

    return (
      <div className="order-page">
        <div className="order-container">
          <div className="">
            <OrderSearchByStatus
              currentStatus={currentStatus}
              onSwitchStatus={this.onSwitchStatus}
            />
          </div>
          <div className="order-search-bar">
            <i className="fas fa-search"></i>
            <input
              name="search"
              placeholder="Tìm kiếm theo Mã đơn hàng, Tên khách hàng hoặc Tên sản phẩm"
              value={this.state.search}
              onChange={this.onChange}
              onKeyPress={this.onKeyPress}
            ></input>
          </div>
          <div className="">{orderList}</div>
          <div>
            <Paging
              onFetchData={this.onFetchData}
              pagingInfo={pageInfo}
              loading={loading}
              location={this.props.location}
            />
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    orderReducer: state.orderReducer,
  };
};

const mapDispatchToProps = (dispatch) => ({
  fetchOrdersRequest: (all, status, search, page) => {
    dispatch(fetchOrdersRequest(all, status, search, page));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(memo(OrderPage));
