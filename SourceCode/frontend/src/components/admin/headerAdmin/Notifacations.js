import React, { Component } from "react";
import { Link } from "react-router-dom";
import {
  COMMENTED,
  REPLIED_COMMENT,
  ORDERED,
  RATED,
  REPLIED_RATE,
  APPROVAL,
  CANCELED_ORDER,
} from "../../../constants/NotificationActTypes";
import { time_ago } from "../../../extentions/ArrayEx";
import Cookie from "js-cookie";

class Notifacations extends Component {
  state = { viewNotification: false, length: 5, viewNotifySystem: false };

  intervalId = 0;

  componentWillUnmount() {
    clearInterval(this.intervalId);
  }

  componentDidMount() {
    this.intervalId = setInterval(this.fectchNotifications, 120000);
    this.fectchNotifications(this.state.viewNotifySystem, this.state.length);
  }

  fectchNotifications = (viewNotifySystem, length) => {
    const accessToken = Cookie.getJSON("x-access-token") || null;
    if (accessToken) this.props.fectchNotifications(viewNotifySystem, length);
  };

  // onMouseEnterHandler = () => {
  //     this.setState({ viewNotification: true });
  // }

  // onMouseLeaveHandler = () => {
  //     if (!this.state.isKeepNotification)
  //         this.setState({ viewNotification: false });
  // }

  viewNotification = () => {
    this.props.onViewNotification();
  };

  render() {
    const { notifications } = this.props.notificationsReducer;
    let count = 0;
    const notificationsElement =
      notifications && notifications.length > 0
        ? notifications.map((notification, index) => {
            let action = null;
            if (this.state.viewNotifySystem)
              switch (notification.action) {
                case COMMENTED:
                  action = {
                    url: `/detail/${notification.target.product._id}`,
                    name: notification.performedBy.name,
                    content: ` đã bình luận sản phẩm ${notification.target.product.name}`,
                  };
                  break;
                case REPLIED_COMMENT:
                  action = {
                    url: `/detail/${notification.target.product._id}`,
                    name: notification.performedBy.name,
                    content: ` đã phản hồi bình luận sản phẩm ${notification.target.product.name}`,
                  };
                  break;
                case ORDERED:
                  action = {
                    url: `/admin/orders/${notification.target.order}`,
                    name: notification.performedBy.name,
                    content: ` đã đặt đơn hàng có mã ${notification.target.order}`,
                  };
                  break;
                case RATED:
                  action = {
                    url: `/detail/${notification.target.product._id}`,
                    name: notification.performedBy.name,
                    content: ` đã đánh giá sản phẩm ${notification.target.product.name}`,
                  };
                  break;
                case REPLIED_RATE:
                  action = {
                    url: `/detail/${notification.target.product._id}`,
                    name: notification.performedBy.name,
                    content: ` đã phản hồi đánh giá sản phẩm ${notification.target.product.name}`,
                  };
                  break;
                case CANCELED_ORDER:
                  action = {
                    url: `/admin/orders/${notification.target.order}`,
                    name: notification.performedBy.name,
                    content: ` đã hủy đơn hàng có mã ${notification.target.order}`,
                  };
                  break;
                default:
                  break;
              }
            else
              switch (notification.action) {
                case REPLIED_COMMENT:
                  action = {
                    url: `/detail/${notification.target.product._id}`,
                    name: notification.performedBy.name,
                    content: ` đã phản hồi bình luận của bạn`,
                  };
                  break;
                case APPROVAL:
                  action = {
                    url: `/orders/${notification.target.order}`,
                    name: "Người quản lí",
                    content: ` đã duyệt đơn hàng của bạn`,
                  };
                  break;
                case REPLIED_RATE:
                  action = {
                    url: `/detail/${notification.target.product._id}`,
                    name: notification.performedBy.name,
                    content: ` đã phản hồi đánh giá của bạn`,
                  };
                  break;
                case CANCELED_ORDER:
                  action = {
                    url: `/orders/${notification.target.order}`,
                    name: "Người quản lí",
                    content: ` đã hủy đơn hàng của bạn`,
                  };
                  break;
                default:
                  break;
              }
            if (!action) return null;
            else {
              if (!notification.check) count++;
              return (
                <div key={notification._id} index={index}>
                  <Link
                    to={action.url}
                    onClick={() => {
                      this.props.updateNotification(notification._id);
                    }}
                    className="notification"
                  >
                    <div className="row" style={{ marginBottom: "5px" }}>
                      <div className="col-2">
                        <div>
                          <img
                            className="mr-2 rounded-circle"
                            src={notification.performedBy.image}
                            alt={notification.performedBy.nam}
                          />
                        </div>
                      </div>
                      <div className="col-9">
                        <div className="row">
                          <div className="content-notification">
                            <strong>{action.name}</strong>
                            {action.content}
                          </div>
                        </div>
                        <div className="row">{time_ago(notification.date)}</div>
                      </div>
                      {!notification.check ? (
                        <div className="col-1">
                          <div className="not-check"></div>
                        </div>
                      ) : (
                        ""
                      )}
                    </div>
                  </Link>
                </div>
              );
            }
          })
        : null;
    //onMouseEnter={this.onMouseEnterHandler} onMouseLeave={this.onMouseLeaveHandler}
    return (
      <>
        <Link
          to="#"
          className="nav-link notifications"
          onClick={(e) => {
            e.preventDefault();
            this.viewNotification();
          }}
        >
          <i className="icon fa fa-bell"></i>
          <span className="num">{count}</span>
        </Link>
        {this.props.viewNotification ? (
          <div className="activity-notification">
            <h4>Thông báo</h4>
            <div
              style={{
                display: "inline-block",
                width: "100%",
                marginTop: "5px",
                marginBottom: "5px",
              }}
            >
              <Link
                to="#"
                onClick={(e) => {
                  e.preventDefault();
                  this.props.clearNotify();
                  this.fectchNotifications(
                    !this.state.viewNotifySystem,
                    this.state.length
                  );
                  this.setState({
                    viewNotifySystem: !this.state.viewNotifySystem,
                  });
                }}
                style={{ float: "right", color: "#1875F0" }}
              >
                Xem với tư cách
                {!this.state.viewNotifySystem ? " quản lý" : " người dùng"}
              </Link>
            </div>
            {notificationsElement}
            {this.props.notificationsReducer.total &&
            this.state.length < this.props.notificationsReducer.total ? (
              <Link
                to="#"
                onClick={(e) => {
                  e.preventDefault();
                  this.fectchNotifications(
                    this.state.viewNotifySystem,
                    this.state.length + 5
                  );
                  this.setState({ length: this.state.length + 5 });
                }}
              >
                Xem thêm
              </Link>
            ) : null}
          </div>
        ) : null}
      </>
    );
  }
}

export default Notifacations;
