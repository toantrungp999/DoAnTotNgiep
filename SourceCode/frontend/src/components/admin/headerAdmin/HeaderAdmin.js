import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { logoutRequest } from "../../../actions/userActions";
import {
  fectchNotificationsRequest,
  updateNotificationRequest,
  clearNotify,
} from "../../../actions/notifacationActions";
import "./HeaderAdmin.css";
import Notifacations from "./Notifacations";
import Messengers from "../../messenger/Messengers";

class HeaderAdmin extends Component {
  state = {
    viewNotification: false,
    viewMessengers: false,
  };

  onViewNotification = () => {
    if (
      this.state.viewMessengers === true &&
      this.state.viewNotification === false
    )
      this.setState({ viewMessengers: false });
    this.setState({ viewNotification: !this.state.viewNotification });
  };

  onViewMessengers = () => {
    if (
      this.state.viewMessengers === false &&
      this.state.viewNotification === true
    )
      this.setState({ viewNotification: false });
    this.setState({ viewMessengers: !this.state.viewMessengers });
  };

  logout = () => {
    this.props.logout();
  };

  render() {
    return (
      <nav className="navbar navbar-expand-sm navbar-dark bg-dark header-admin">
        <Link className="navbar-brand pl-4" to="/">
          <i className="fas fa-home pr-1"></i>Trang chủ
        </Link>
        <button
          className="navbar-toggler d-lg-none"
          type="button"
          data-toggle="collapse"
          data-target="#collapsibleNavId"
          aria-controls="collapsibleNavId"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <i className="fas fa-bars"></i>
        </button>
        <div className="collapse navbar-collapse" id="collapsibleNavId">
          <ul className="navbar-nav ml-auto mt-2 mt-lg-0">
            <li className="nav-item meseenger-icon">
              <Messengers
                onViewMessengers={this.onViewMessengers}
                viewMessengers={this.state.viewMessengers}
              />
            </li>
            <li className="nav-item">
              <Notifacations
                onViewNotification={this.onViewNotification}
                viewNotification={this.state.viewNotification}
                clearNotify={this.props.clearNotify}
                notificationsReducer={this.props.notificationsReducer}
                fectchNotifications={this.props.fectchNotifications}
                updateNotification={this.props.updateNotification}
              />
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/" onClick={this.logout}>
                Đăng xuất
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    userInfoReducer: state.userInfoReducer,
    notificationsReducer: state.notificationsReducer,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    logout: () => dispatch(logoutRequest()),
    fectchNotifications: (admin, pageSize) =>
      dispatch(fectchNotificationsRequest(admin, pageSize)),
    updateNotification: (_id) => dispatch(updateNotificationRequest(_id)),
    clearNotify: () => dispatch(clearNotify),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(HeaderAdmin);
