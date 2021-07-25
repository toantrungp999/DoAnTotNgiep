import React, { Component, memo } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { logoutRequest } from "../../../actions/userActions";
import { fectchBrandsRequest } from "../../../actions/brandActions";
import { fectchCartsRequest } from "../../../actions/cartActions";
import { fectchCategoriesRequest } from "../../../actions/categoryActions";
import { searchProductsRequest } from "../../../actions/productActions";
import { fectchCategoryGroupsWithCategoryRequest } from "../../../actions/categoryGroupActions";
import {
  fectchNotificationsRequest,
  updateNotificationRequest,
  clearNotify,
} from "../../../actions/notifacationActions";
import Search from "../../customer/search/Search";
import ConfirmDialog from "../../common/dialogs/ConfirmDialog";
import { LogoutOutlined } from "@ant-design/icons";
import Notifacations from "./Notifications";
import ROLES from "../../../constants/Roles";
import Collapse from "@material-ui/core/Collapse";
import Messengers from "../../messenger/Messengers";

import "./HeaderCustomer.css";

class HeaderCustomer extends Component {
  state = {
    search: false,
    menu: false,
    logout: false,
    viewNotification: false,
    viewMessengers: false,
    prevScrollpos: window.pageYOffset,
    visible: true,
  };

  logout = (e) => {
    e.preventDefault();
    this.setState({ logout: true });
  };

  onViewNotification = () => {
    if (
      this.state.viewMessengers === true &&
      this.state.viewNotification === false
    )
      this.setState({ viewMessengers: false, menu: false, search: false });
    this.setState({
      viewNotification: !this.state.viewNotification,
      menu: false,
      search: false,
    });
  };

  onViewMessengers = () => {
    if (
      this.state.viewMessengers === false &&
      this.state.viewNotification === true
    )
      this.setState({ viewNotification: false, menu: false, search: false });
    this.setState({
      viewMessengers: !this.state.viewMessengers,
      menu: false,
      search: false,
    });
  };

  confirmLogout = () => {
    this.props.logout();
    this.props.history.push("/");
  };

  closeLogout = () => {
    this.setState({ logout: false });
  };

  componentDidMount() {
    const { userInfo } = this.props.userInfoReducer;
    if (userInfo) this.props.fectchCarts();
    this.props.fectchBrands();
    this.props.fectchCategoryGroupsWithCategory();
    window.addEventListener("scroll", this.handleScroll);
  }

  openSearch = () => {
    this.setState({
      search: !this.state.search,
      menu: false,
      viewNotification: false,
      viewMessengers: false,
    });
  };

  closeSearch = () => {
    this.setState({ search: false });
  };

  dropMenu = (event) => {
    event.preventDefault();
    this.setState({
      menu: !this.state.menu,
      search: false,
      viewNotification: false,
      viewMessengers: false,
    });
  };

  onCloseDropMenu = (e) => {
    this.setState({ menu: false });
  };

  getLastKeyword(text) {
    let result = [];
    for (let i = text.length - 1; i >= 0; i--) {
      if (text.length - i > 15) break;
      result.push(text[i]);
    }
    return result.reverse().join("");
  }

  handleScroll = () => {
    const { prevScrollpos, search, menu, viewMessengers, viewNotification } =
      this.state;

    const currentScrollPos = window.pageYOffset;
    const visible =
      window.pageYOffset < 100 ||
      prevScrollpos > currentScrollPos ||
      search ||
      menu ||
      viewMessengers ||
      viewNotification;

    this.setState({
      prevScrollpos: currentScrollPos,
      visible,
    });
  };

  render() {
    const { userInfo } = this.props.userInfoReducer;
    const { categoryGroups } = this.props.categoryGroupsReducer;
    const { logout } = this.state;
    const role = userInfo?.role || "none";
    const { carts } = this.props.cartsReducer;
    const totalCart = carts?.length || 0;

    let name = "";
    if (userInfo) {
      const nameLength = userInfo.name.length;
      name =
        nameLength > 12
          ? "..." + userInfo.name.slice(nameLength - 12)
          : userInfo.name;
    }

    const routes = userInfo ? (
      <>
        {role && role !== ROLES.CUSTOMER ? (
          <div className="link-admin">
            <Link to="/admin">
              <i className="fas fa-user-shield pr-1"></i>
            </Link>
          </div>
        ) : null}
        <div onClick={this.openSearch}>
          <i className="icon fa fa-search"></i>
        </div>
        <div className="cart-icon-container">
          <Link className="nav-link" to="/cart">
            <i className="icon fas fa-shopping-cart" aria-hidden="true"></i>
            {totalCart !== 0 ? (
              <span className="num">{totalCart}</span>
            ) : (
              <span className="num">0</span>
            )}
          </Link>
        </div>
        <div className="meseenger-icon">
          <Messengers
            onViewMessengers={this.onViewMessengers}
            viewMessengers={this.state.viewMessengers}
          />
        </div>
        <div className="notification-icon-container">
          <Notifacations
            onViewNotification={this.onViewNotification}
            viewNotification={this.state.viewNotification}
            clearNotify={this.props.clearNotify}
            role={role}
            notificationsReducer={this.props.notificationsReducer}
            fectchNotifications={this.props.fectchNotifications}
            updateNotification={this.props.updateNotification}
          />
        </div>
        <div className="header-info nav-item">
          <Link className="drop-btn" to="/orders">
            <img
              className="img-header-avatar"
              src={userInfo.image}
              alt="Avatar"
            ></img>{" "}
            <span className="header-info-name">
              {this.getLastKeyword(name)}
            </span>
          </Link>
          <div className="dropdown-info">
            <ul>
              <li>
                <Link to="/account">Thông tin</Link>
              </li>
              <li>
                <Link to="/orders">Đơn hàng</Link>
              </li>
              <li>
                <Link to="/" onClick={this.logout}>
                  <LogoutOutlined /> Đăng xuất
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </>
    ) : (
      <>
        <div onClick={this.openSearch}>
          <i className="icon fa fa-search"></i>
        </div>
        <div className="login-link">
          <Link className="" to="/login">
            Đăng nhập
          </Link>
        </div>
      </>
    );

    const pathMenu = (
      <>
        <div className="path-node homepage">
          <Link className="" to={"/all-product"} onClick={this.onCloseDropMenu}>
            Tất cả sản phẩm
          </Link>
        </div>
        <div className="path-node">
          <Link className="" to={"/new-product"} onClick={this.onCloseDropMenu}>
            Sản phẩm mới
          </Link>
        </div>
        <div className="path-node">
          <Link className="" to={"/hot-product"} onClick={this.onCloseDropMenu}>
            Nổi bật
          </Link>
        </div>
        <div className="path-node">
          <Link className="" to={"/best-seller"} onClick={this.onCloseDropMenu}>
            Bán chạy
          </Link>
        </div>
        <div className="path-node">
          <Link className="" to={"/sale-off"} onClick={this.onCloseDropMenu}>
            Khuyến mãi
          </Link>
        </div>
        <div className="path-node">
          <Link className="" to={"/black-color"} onClick={this.onCloseDropMenu}>
            Everything Black
          </Link>
        </div>
      </>
    );
    const userMenu = userInfo ? (
      <>
        <div>
          <Link to="/account">Thông tin</Link>
        </div>
        <div>
          <Link to="/orders">Đơn hàng</Link>
        </div>
        <div>
          <Link className="log-out" to="/" onClick={this.logout}>
            <LogoutOutlined /> Đăng xuất
          </Link>
        </div>
      </>
    ) : (
      ""
    );

    const menu = categoryGroups
      ? categoryGroups.map((group) => {
          const categoryMenu =
            group.categorys?.length > 0
              ? group.categorys.map((category) => {
                  return (
                    <Link
                      key={category._id}
                      to={`/category?key=${category._id}`}
                      onClick={this.onCloseDropMenu}
                    >
                      {category.name}
                    </Link>
                  );
                })
              : null;

          if (categoryMenu === null) return null;

          return (
            <div className="category-node" key={group.categoryGroup._id}>
              <Link
                className="category-group"
                to={`/category-group?key=${group.categoryGroup._id}`}
                onClick={this.onCloseDropMenu}
              >
                {group.categoryGroup.name}
              </Link>
              <div className="categorys">{categoryMenu}</div>
            </div>
          );
        })
      : "";

    return (
      <div
        className={"header-customer" + (this.state.visible ? "" : " hidden")}
      >
        {logout ? (
          <ConfirmDialog
            message="Bạn có muốn đăng xuất"
            onConfirm={this.confirmLogout}
            onClose={this.closeLogout}
          />
        ) : (
          ""
        )}
        <div className="icon-menu">
          <i className="fas fa-bars" onClick={this.dropMenu}></i>
          <div className="dropdown-header-menu">
            <Collapse in={this.state.menu} timeout={500}>
              <div className="top-menu">
                <div className="path-menus">{pathMenu}</div>
                <div className="user-menus">{userMenu}</div>
              </div>
              <div className="category-menus">{menu}</div>
            </Collapse>
          </div>
        </div>
        <Search
          closeSearch={this.closeSearch}
          history={this.props.history}
          searchProductsReducer={this.props.searchProductsReducer}
          searchProducts={this.props.searchProducts}
          location={this.props.location}
          show={this.state.search}
        />
        <div className="path-header">
          <Link className="homepage-path" to="/">
            <img src="/webicon.ico" alt="logo" />
            <span>BlueFashion</span>{" "}
          </Link>
          <Link to="/best-seller">Bán chạy </Link>
          <Link to="/new-product">Sản phẩm mới</Link>
          <Link to="/hot-product">Nổi bật</Link>
        </div>
        <div className="icon-menu-header">{routes}</div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    cartsReducer: state.cartsReducer,
    userInfoReducer: state.userInfoReducer,
    productsReducer: state.productsReducer,
    searchProductsReducer: state.searchProductsReducer,
    notificationsReducer: state.notificationsReducer,
    categoryGroupsReducer: state.categoryGroupsReducer,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    logout: () => dispatch(logoutRequest()),
    fectchBrands: () => {
      dispatch(fectchBrandsRequest("true"));
    },
    fectchCarts: () => {
      dispatch(fectchCartsRequest());
    },
    fectchCategories: () => {
      dispatch(fectchCategoriesRequest("true"));
    },
    fectchCategoryGroupsWithCategory: () => {
      dispatch(fectchCategoryGroupsWithCategoryRequest("true"));
    },
    searchProducts: (key) => {
      dispatch(searchProductsRequest(key));
    },
    fectchNotifications: (admin, pageSize) =>
      dispatch(fectchNotificationsRequest(admin, pageSize)),
    updateNotification: (_id) => dispatch(updateNotificationRequest(_id)),
    clearNotify: () => dispatch(clearNotify),
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(memo(HeaderCustomer));
