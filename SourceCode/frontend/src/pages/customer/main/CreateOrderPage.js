import React, { Component, memo } from "react";
import { connect } from "react-redux";
import { convertNumberToVND } from "../../../extentions/ArrayEx";
import OrderType from "../../../components/order/OrderType";
import Loading from "../../../components/common/loading/Loading";
import {
  fetchProductRequest,
  createOrderRequest,
  clearState,
  ShippingFeeRequest,
  fetchStoreAddressesRequest,
} from "../../../actions/orderActions";
import { Link, Redirect } from "react-router-dom";
import { fetchAddressesRequest } from "../../../actions/userActions";
import "./CreateOrderPage.css";

class CreateOrderPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showAlert: false,
      redirect: false,
      callApi: false,
    };
  }

  componentDidMount() {
    if (this.props.location.state !== undefined) {
      const { selectedList } = this.props.location.state;
      this.props.fetchStoreAddressesRequest();
      this.props.fetchAddressesRequest();
      this.props.fetchProductRequest({ cartIdList: selectedList });
    } else {
      this.props.history.push("/cart");
    }
  }

  GoBack = () => {
    this.props.history.push("/cart");
  };

  onHideAlert = () => {
    this.setState({ showAlert: false });
  };

  onShowAlert = () => {
    this.setState({
      showAlert: true,
    });
  };

  CreateOrder = () => {
    let optionList = this.props.createOrderReducer.carts.map((cart) => {
      return { _id: cart._id, quantity: cart.quantity };
    });
    let addressId = this.state.addressId;
    let type = this.state.orderType;
    let data = { optionList, addressId, type };
    this.props.createOrderRequest(data);
    this.setState({
      showAlert: true,
      callApi: true,
    });
  };

  render() {
    let { loading, carts, createSuccess, orderInfo } =
      this.props.createOrderReducer;
    if (loading)
      return (
        <div>
          <Loading />
        </div>
      );
    if (createSuccess !== undefined && orderInfo !== undefined) {
      if (createSuccess === true) {
        this.props.clearState();
        return (
          <Redirect
            to={{
              pathname: `/orders/${orderInfo._id}`,
              state: { message: "Đặt hàng thành công" },
            }}
          />
        );
      }
    }

    let total = 0;

    let cartList = carts
      ? carts.map((cart, index) => {
          let { colorId, sizeId, quantity } = cart;
          let { price, saleOff, name } = colorId.productId;
          //console.log(this.state.selectedList);
          total += price * quantity - saleOff * quantity;
          let type =
            (colorId.color ? colorId.color : "") +
            " - " +
            (sizeId.size ? sizeId.size : "");
          return (
            <div className={"product-item " + (index === 0 && "first")}>
              <img className="" alt={name} src={colorId.image} />
              <div className="product-info">
                <span className="name">{name}</span>
                <span className="type">{type}</span>
                <span className="price-quantity">
                  {saleOff !== 0 ? (
                    <del className="orgin-price">
                      {convertNumberToVND(price)}₫
                    </del>
                  ) : (
                    ""
                  )}
                  <span className="price">
                    {convertNumberToVND(price - saleOff)}₫
                  </span>
                  <span className="quantity">x{quantity}</span>
                </span>
                <span className="total-price price">
                  {convertNumberToVND(price * quantity - saleOff * quantity)}₫
                </span>
              </div>
            </div>
          );
        })
      : "";

    return (
      <div className="create-order-page">
        <Link to={"/cart"} className="btn-back-create-order">
          <i className="fas fa-chevron-left pr-2"></i>TRỞ LẠI
        </Link>
        <div className="product-section">
          <h4 className="mt-20">Đặt hàng</h4>
          {cartList}
        </div>
        <div>
          <OrderType
            createSuccess={createSuccess}
            total={total}
            onShowAlert={this.onShowAlert}
          />
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    createOrderReducer: state.createOrderReducer,
  };
};

const mapDispatchToProps = (dispatch) => ({
  fetchProductRequest: (cartIdList) => {
    dispatch(fetchProductRequest(cartIdList));
  },
  createOrderRequest: (Order) => {
    dispatch(createOrderRequest(Order));
  },
  fetchAddressesRequest: () => {
    dispatch(fetchAddressesRequest());
  },
  clearState: () => {
    dispatch(clearState());
  },
  ShippingFeeRequest: (addressId) => {
    dispatch(ShippingFeeRequest(addressId));
  },
  fetchStoreAddressesRequest: () => {
    dispatch(fetchStoreAddressesRequest());
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(memo(CreateOrderPage));
