import React, { Component } from "react";
import { connect } from "react-redux";
import { Router, Route, Switch } from "react-router-dom";
import Login from "./../pages/customer/login/Login";
import Register from "./../pages/customer/register/Register";
import ForgotPassword from "./../pages/customer/forgotPassword/ForgotPassword";
import Footer from "../components/customer/footerCustomer/Footer";
import HeaderCustomer from "../components/customer/headerCustomer/HeaderCustomer";
import HomeAdmin from "./../pages/admin/main/HomeAdmin";
import FooterAdmin from "../components/admin/footerAdmin/FooterAdmin";
import HeaderAdmin from "../components/admin/headerAdmin/HeaderAdmin";
import HomePage from "../pages/customer/main/HomePage";
import ProductPage from "../pages/customer/main/ProductPage";
import BasketCartPage from "../pages/customer/main/BasketCartPage";
import CreateOrderPage from "../pages/customer/main/CreateOrderPage";
import PayPage from "../pages/customer/main/PayPage";
import DetailProductPage from "../pages/customer/main/DetailProductPage";
import ResetPassword from "../pages/customer/resetPassword/ResetPassword";
import NotFound from "./../pages/customer/notFound/NotFound";
import history from "../extentions/history";
import NavCustomer from "../pages/customer/navCustomer/NavCustomer";
import Alert from "../components/common/alertItem/Alert";
import ROLES from "../constants/Roles";

import * as Types from "../constants/MessengerActTypes";
import DetailMessage from "../components/messenger/DetailMessage";
import CreateMessage from "../components/messenger/CreateMessage";

class Routes extends Component {
  render() {
    const { userInfo } = this.props.userInfoReducer;
    const { action, to, index } = this.props.messengersReducer;

    const role = userInfo && userInfo.role ? userInfo.role : null;
    return (
      <Router history={history}>
        <Switch>
          {role && role !== ROLES.CUSTOMER ? (
            <Route path="/admin" component={HeaderAdmin} />
          ) : (
            ""
          )}
          <Route path="/" component={HeaderCustomer} />
        </Switch>
        <div className="body-background">
          {userInfo && action === Types.CREATE_NEW_MESSAGE ? (
            <CreateMessage role={role} />
          ) : null}
          {userInfo && action === Types.OPEN_DETAIL_MESSENGER ? (
            <DetailMessage userId={userInfo._id} to={to} index={index} />
          ) : null}
          <Alert />
          <Switch>
            <Route exact path="/" component={HomePage} />
            {/* <Route path="/search=:search/option=:option/paging=:paging" component={HomePage} />
                        <Route path="/search=:search/option=:option" component={HomePage} />
                        <Route path="/search=:search/paging=:paging" component={HomePage} />
                        <Route path="/search=:search" component={HomePage} /> */}

            {/* <Route path="/brand=:brandId/category=:categoryId/option=:option/paging=:paging" component={HomePage} />
                        <Route path="/brand=:brandId/category=:categoryId/option=:option" component={HomePage} />
                        <Route path="/brand=:brandId/category=:categoryId/paging=:paging" component={HomePage} />
                        <Route path="/brand=:brandId/category=:categoryId" component={HomePage} /> */}

            {/* <Route path="/category=:categoryId/option=:option/paging=:paging" component={HomePage} />
                        <Route path="/category=:categoryId/option=:option" component={HomePage} />
                        <Route path="/category=:categoryId/paging=:paging" component={HomePage} />
                        <Route path="/category=:categoryId" component={HomePage} /> */}

            {/* <Route path="/brand=:brandId/option=:option/paging=:paging" component={HomePage} />
                        <Route path="/brand=:brandId/option=:option" component={HomePage} />
                        <Route path="/brand=:brandId/paging=:paging" component={HomePage} />
                        <Route path="/brand=:brandId" component={HomePage} /> */}

            {/* <Route path="/option=:option/paging=:paging" component={HomePage} />
                        <Route path="/option=:option" component={HomePage} />
                        <Route path="/paging=:paging" component={HomePage} /> */}

            <Route path="/new-product" component={ProductPage} />
            <Route path="/hot-product" component={ProductPage} />
            <Route path="/best-seller" component={ProductPage} />
            <Route path="/all-product" component={ProductPage} />
            <Route path="/search" component={ProductPage} />
            <Route exact path="/category" component={ProductPage} />
            <Route exact path="/category-group" component={ProductPage} />
            <Route exact path="/sale-off" component={ProductPage} />
            <Route exact path="/summer-sale" component={ProductPage} />
            <Route exact path="/black-color" component={ProductPage} />
            {role && role !== ROLES.CUSTOMER ? (
              <Route path="/admin" component={HomeAdmin} />
            ) : (
              ""
            )}
            {role ? <Route path="/account" component={NavCustomer} /> : null}
            {role ? <Route path="/cart" component={BasketCartPage} /> : null}
            {role ? (
              <Route path="/orders/create" exact component={CreateOrderPage} />
            ) : null}
            {role ? (
              <Route path="/orders" exact component={NavCustomer} />
            ) : null}
            {role ? (
              <Route path="/orders/:_id" exact component={NavCustomer} />
            ) : null}
            {role ? <Route path="/pay/:_id" exact component={PayPage} /> : null}
            <Route path="/login" component={Login} />
            <Route path="/detail/:_id" component={DetailProductPage} />
            <Route path="/register" component={Register} />
            <Route path="/forgotpassword" component={ForgotPassword} />
            <Route path="/reset-password/:code" component={ResetPassword} />
            <Route path="*" exact={true} component={NotFound} />
          </Switch>
        </div>
        <Switch>
          {role && role !== ROLES.CUSTOMER ? (
            <Route path="/admin" component={FooterAdmin} />
          ) : (
            ""
          )}
          <Route path="/" component={Footer} />
        </Switch>
      </Router>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    userInfoReducer: state.userInfoReducer,
    messengersReducer: state.messengersReducer,
  };
};

export default connect(mapStateToProps, null)(Routes);
