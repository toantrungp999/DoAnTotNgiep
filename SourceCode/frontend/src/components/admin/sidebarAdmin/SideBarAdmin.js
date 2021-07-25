import React, { Component } from "react";
import { connect } from "react-redux";
import "./SideBarAdmin.css";
import { Link } from "react-router-dom";
import ROLES from "../../../constants/Roles";

class SideBarAdmin extends Component {
  render() {
    const { name, image } = this.props.userInfoReducer.userInfo;
    var path;
    let pathname = this.props.location;
    if (pathname.includes("orders")) path = "orders";
    else if (pathname.includes("users")) path = "users";
    else if (pathname.includes("brands")) path = "brands";
    else if (pathname.includes("categories")) path = "categories";
    else if (pathname.includes("category-groups")) path = "category-groups";
    else if (
      pathname.includes("products") ||
      pathname.includes("productoptions")
    )
      path = "products";
    else if (pathname.includes("statistics")) path = "statistics";
    else path = "orders";
    return (
      <div id="sidebar-admin">
        <div className="sidebar-header">
          <div>
            <img className="avatar" alt={name} src={image}></img>
            <span className="user-name">{name}</span>
          </div>
        </div>
        <ul className="components" id="ul-manager">
          <li className="nav-item task">
            <Link
              className={"nav-link" + (path === "orders" ? " active" : "")}
              to="/admin/orders"
            >
              <i className="fas fa-receipt mr-2"></i>Quản lý đơn hàng
            </Link>
          </li>
          <li className="nav-item task">
            {this.props.role === ROLES.SUPER_ADMIN ? (
              <Link
                className={"nav-link" + (path === "users" ? " active" : "")}
                to="/admin/users"
              >
                <i className="fas fa-users mr-2"></i>Quản lý người dùng
              </Link>
            ) : (
              ""
            )}
          </li>
          <li className="nav-item task">
            {this.props.role === ROLES.SUPER_ADMIN ? (
              <Link
                className={"nav-link" + (path === "brands" ? " active" : "")}
                to="/admin/brands"
              >
                <i className="fas fa-copyright mr-2"></i>Quản lý hãng
              </Link>
            ) : (
              ""
            )}
          </li>
          <li className="nav-item task">
            {this.props.role === ROLES.SUPER_ADMIN ? (
              <Link
                className={
                  "nav-link" + (path === "category-groups" ? " active" : "")
                }
                to="/admin/category-groups"
              >
                <i className="fas fa-layer-group mr-2"></i>Quản lý nhóm loại
              </Link>
            ) : (
              ""
            )}
          </li>
          <li className="nav-item task">
            {this.props.role === ROLES.SUPER_ADMIN ? (
              <Link
                className={
                  "nav-link" + (path === "categories" ? " active" : "")
                }
                to="/admin/categories"
              >
                <i className="fas fa-box-open mr-2"></i>Quản lý loại
              </Link>
            ) : (
              ""
            )}
          </li>
          <li className="nav-item task">
            {this.props.role === ROLES.SUPER_ADMIN ? (
              <Link
                className={"nav-link" + (path === "products" ? " active" : "")}
                to="/admin/products"
              >
                <i className="fas fa-tshirt mr-2"></i>Quản lý sản phẩm
              </Link>
            ) : (
              ""
            )}
          </li>
          <li className="nav-item task">
            {this.props.role === ROLES.SUPER_ADMIN ? (
              <Link
                className={
                  "nav-link" + (path === "statistics" ? " active" : "")
                }
                to="/admin/statistics"
              >
                <i className="fas fa-chart-area mr-2"></i>Thống kê
              </Link>
            ) : (
              ""
            )}
          </li>
        </ul>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    userInfoReducer: state.userInfoReducer,
  };
};

const mapDispatchToProps = (dispatch, props) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(SideBarAdmin);
