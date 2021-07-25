import React, { Component, memo } from "react";
import { connect } from "react-redux";
import { Route, Switch, Link } from "react-router-dom";
import OrderPage from "../main/OrderPage";
import OrderDetailPage from "../main/OrderDetailPage";
import ChangeAccount from "../changeAccount/ChangeAccount";
import { fetchProfileRequest } from "../../../actions/userActions";
import { Collapse } from "@material-ui/core/";
import {
  InfoOutlined,
  UserOutlined,
  EnvironmentOutlined,
  PhoneOutlined,
  KeyOutlined,
  FileDoneOutlined,
  DoubleRightOutlined,
  DoubleLeftOutlined,
} from "@ant-design/icons";
import "./NavCustomer.css";

class NavCustomer extends Component {
  state = {
    showNav: false,
  };
  componentDidMount() {
    this.props.fetchProfile();
    if (!this.props.location.pathname.includes("account")) {
      this.setState({ showProfileList: false });
    }
  }

  showNav = () => {
    this.setState({
      showNav: !this.state.showNav,
    });
  };

  render() {
    const { userProfileReducer } = this.props;
    const { name } = this.props.userInfoReducer.userInfo;
    const { image } = userProfileReducer.userProfile
      ? userProfileReducer.userProfile
      : "";
    let isChangeAccount = this.props.location.pathname.includes("account");
    let isProfile = this.props.location.pathname.includes("profile");
    let isAddresses = this.props.location.pathname.includes("addresses");
    let isPassword = this.props.location.pathname.includes("password");
    let isPhoneNumber = this.props.location.pathname.includes("phonenumber");
    let isOrders = this.props.location.pathname.includes("orders");
    if (this.props.location.pathname === "/account") isProfile = true;
    return (
      <div className="nav-customer-page">
        <div
          className={"nav-customer" + (this.state.showNav ? " is-show" : "")}
        >
          <div
            className={"show-hide" + (this.state.showNav ? " is-show" : "")}
            onClick={this.showNav}
          >
            {this.state.showNav ? (
              <DoubleLeftOutlined />
            ) : (
              <DoubleRightOutlined />
            )}
          </div>
          <div className="user-info">
            <img className="avatar-nav-left" alt={"Avatar"} src={image}></img>
            <label className="user-name">{name}</label>
          </div>

          <div className="account">
            <Link
              className={isChangeAccount ? "active" : ""}
              to="/account/profile"
              onClick={this.showNav}
            >
              <UserOutlined className="icon account" />
              Tài khoản
            </Link>
          </div>
          <Collapse in={isChangeAccount}>
            <div className="accounts">
              <div>
                <Link
                  className={isProfile ? "active" : ""}
                  to="/account/profile"
                  onClick={this.showNav}
                >
                  <InfoOutlined className="icon info" />
                  Thông tin
                </Link>
              </div>
              <div>
                <Link
                  className={isAddresses ? "active" : ""}
                  to="/account/addresses"
                  name="showAddress"
                  onClick={this.showNav}
                >
                  <EnvironmentOutlined className="icon address" />
                  Địa chỉ
                </Link>
              </div>
              <div>
                <Link
                  className={isPassword ? "active" : ""}
                  to="/account/password"
                  name="showChangepassword"
                  onClick={this.showNav}
                >
                  <KeyOutlined className="icon password" />
                  Mật khẩu
                </Link>
              </div>
              <div>
                <Link
                  className={isPhoneNumber ? "active" : ""}
                  to="/account/phonenumber"
                  name="showChangePhone"
                  onClick={this.showNav}
                >
                  <PhoneOutlined className="icon phone" />
                  Số điện thoại
                </Link>
              </div>
            </div>
          </Collapse>
          <div className="order">
            <Link
              className={isOrders ? "active" : ""}
              to="/orders"
              onClick={this.showNav}
            >
              <FileDoneOutlined className="icon order" />
              Đơn hàng
            </Link>
          </div>
        </div>
        <div className="main-content">
          <Switch>
            <Route path="/account/:feature" component={ChangeAccount} />
            <Route path="/account/" component={ChangeAccount} />
            <Route path="/orders" exact component={OrderPage} />
            <Route path="/orders/:_id" exact component={OrderDetailPage} />
          </Switch>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    userProfileReducer: state.userProfileReducer,
    userInfoReducer: state.userInfoReducer,
  };
};

const mapDispatchToProps = (dispatch, props) => {
  return {
    fetchProfile: () => {
      dispatch(fetchProfileRequest());
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(memo(NavCustomer));
