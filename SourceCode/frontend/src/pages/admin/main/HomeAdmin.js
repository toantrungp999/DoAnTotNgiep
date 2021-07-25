import React, { Component, memo } from "react";
import { connect } from "react-redux";
import { Route, Switch } from "react-router-dom";
import Users from "../users/Users";
import Brands from "../brands/Brands";
import Categories from "../categories/Categories";
import CategoryGroups from "../categoryGroups/CategoryGroups";
import DetailUser from "../users/DetailUser";
import SidebarAdmin from "../../../components/admin/sidebarAdmin/SideBarAdmin";
import ProductsPage from "../products/ProductsPage";
import CreateProductPage from "../products/CreateProductPage";
import DetailProductPage from "../products/DetailProductPage";
import ProductOptions from "../productOptions/ProductOptions";
import AdminOrderPage from "../orders/AdminOrderPage";
import AdminOrderDetailPage from "../orders/AdminOrderDetailPage";
import StatisticsPage from "../statistics/StatisticsPage";
import NotFound from "../notFound/NotFound";
import ROLES from "../../../constants/Roles";
import "./HomeAdmin.css";

class HomeAdmin extends Component {
  render() {
    const { userInfo } = this.props.userInfoReducer;
    const role = userInfo.role;

    return (
      <div className="home-admin-page">
        <div className="admin-sidebar-container">
          <SidebarAdmin location={this.props.location.pathname} role={role} />
        </div>
        <div className="admin-page-container">
          <div className="">
            <Switch>
              {role === ROLES.SUPER_ADMIN ? (
                <Route
                  path="/admin/users/search=:search/paging=:paging"
                  component={Users}
                />
              ) : null}
              {role === ROLES.SUPER_ADMIN ? (
                <Route path="/admin/users/search=:search" component={Users} />
              ) : null}
              {role === ROLES.SUPER_ADMIN ? (
                <Route path="/admin/users/paging=:paging" component={Users} />
              ) : null}
              {role === ROLES.SUPER_ADMIN ? (
                <Route exact path="/admin/users" component={Users} />
              ) : null}
              {role === ROLES.SUPER_ADMIN ? (
                <Route path="/admin/users/detail/:_id" component={DetailUser} />
              ) : (
                ""
              )}
              {role === ROLES.SUPER_ADMIN ? (
                <Route path="/admin/statistics" component={StatisticsPage} />
              ) : (
                ""
              )}
              <Route
                path="/admin/products/search=:search/paging=:paging"
                component={ProductsPage}
              />
              <Route
                path="/admin/products/search=:search"
                component={ProductsPage}
              />
              <Route
                path="/admin/products/paging=:paging"
                component={ProductsPage}
              />

              <Route exact path="/admin/brands" component={Brands} />
              <Route exact path="/admin/categories" component={Categories} />
              <Route
                exact
                path="/admin/category-groups"
                component={CategoryGroups}
              />
              <Route exact path="/admin" component={AdminOrderPage} />
              <Route exact path="/admin/orders" component={AdminOrderPage} />
              <Route exact path="/admin/products" component={ProductsPage} />
              <Route
                exact
                path="/admin/products/create"
                component={CreateProductPage}
              />

              <Route
                path="/admin/products/detail/:_id"
                component={DetailProductPage}
              />

              <Route
                path="/admin/productoptions/:_id"
                component={ProductOptions}
              />
              <Route
                path="/admin/orders/:_id"
                component={AdminOrderDetailPage}
              />
              <Route path="*" exact={true} component={NotFound} />
            </Switch>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    userInfoReducer: state.userInfoReducer,
  };
};

export default connect(mapStateToProps, null)(memo(HomeAdmin));
