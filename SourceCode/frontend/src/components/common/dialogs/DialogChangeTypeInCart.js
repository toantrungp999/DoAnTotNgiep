import React, { Component, memo } from "react";
import { convertNumberToVND, findIndexById } from "../../../extentions/ArrayEx";
import { connect } from "react-redux";
import { updateTypeCartRequest } from "../../../actions/cartActions";
import {
  fectchColorOptionsRequest,
  fectchQuantityOptionsRequest,
  fectchSizeOptionsRequest,
} from "../../../actions/productOptionActions";
import { Tooltip } from "antd";
import "./dialogs.css";
import "./DialogChangeTypeInCart.css";

class DialogChangeTypeInCart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      quantityOption: "",
      quantity: 1,
      isUpdateType: false,
    };
  }

  onUpdateType = () => {
    let { quantityOption, quantity } = this.state;
    this.props.updateTypeCart({
      cartId: this.props.cartId,
      sizeId: quantityOption.sizeId,
      colorId: quantityOption.colorId,
      quantity,
    });
    this.setState({ isUpdateType: true });
  };

  onChangeType = (name, value) => {
    if (name === "colorId") {
      let { quantityOptions } = this.props.productOptionsReducer;
      if (quantityOptions) {
        let i = quantityOptions.length - 1;
        for (; i >= 0; i--)
          if (
            quantityOptions[i].sizeId === this.state.quantityOption.sizeId &&
            quantityOptions[i].colorId === value
          ) {
            this.setState({
              quantityOption: quantityOptions[i],
            });
            break;
          }
      }
    } else if (name === "sizeId") {
      let { quantityOptions } = this.props.productOptionsReducer;
      if (quantityOptions) {
        let i = quantityOptions.length - 1;
        for (; i >= 0; i--)
          if (
            quantityOptions[i].sizeId === value &&
            quantityOptions[i].colorId === this.state.quantityOption.colorId
          ) {
            this.setState({
              quantityOption: quantityOptions[i],
            });
            break;
          }
      }
    }
  };

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps) {
      let { cartsReducer, productOptionsReducer } = nextProps;
      let { updateTypeStatus } = cartsReducer;
      if (!this.state.quantityOption && productOptionsReducer) {
        let { quantityOptions } = productOptionsReducer;
        if (
          !this.state.isUpdateType &&
          quantityOptions &&
          quantityOptions.length > 0
        ) {
          for (let i = quantityOptions.length - 1; i >= 0; i--)
            if (
              quantityOptions[i].sizeId === this.props.sizeId &&
              quantityOptions[i].colorId === this.props.colorId
            ) {
              this.setState({
                quantityOption: quantityOptions[i],
              });
              break;
            }
        }
      }
      if (updateTypeStatus && this.state.isUpdateType) {
        this.props.onClose();
        this.setState({ isUpdateType: false });
      }
    }
  }

  componentDidMount() {
    this.props.fectchColorOptions(this.props.productId);
    this.props.fectchSizeOptions(this.props.productId);
    this.props.fectchQuantityOptions(this.props.productId);
    this.setState({
      quantity: this.props.quantity,
      quantityInStore: this.props.quantityInStore,
    });
  }

  onUp = () => {
    let { quantity } = this.state;
    if (quantity < this.state.quantityOption.quantity && quantity < 5) {
      quantity += 1;
      this.setState({ quantity });
    }
  };

  onDown = () => {
    let { quantity } = this.state;
    if (quantity > 1) {
      quantity -= 1;
      this.setState({ quantity });
    }
  };

  render() {
    const { quantityOption } = this.state;
    if (!quantityOption) {
      return <div></div>;
    }

    let {
      colorOptions,
      quantityOptions,
      sizeOptions,
      colorLoading,
      sizeLoading,
      quantityLoading,
    } = this.props.productOptionsReducer;
    if (colorLoading || sizeLoading || quantityLoading) return null;

    let chooseSizes = sizeOptions
      ? sizeOptions.map((sizeOption, index) => {
          for (let i = quantityOptions.length - 1; i >= 0; i--) {
            if (quantityOptions[i].sizeId === sizeOption._id)
              return (
                <span
                  key={sizeOption._id}
                  className={
                    "size" +
                    (quantityOption.sizeId === sizeOption._id ? " check" : "")
                  }
                  onClick={() => {
                    this.onChangeType("sizeId", sizeOption._id);
                  }}
                >
                  {sizeOption.size}
                </span>
              );
          }
          return null;
        })
      : "";

    let Choosecolors = colorOptions
      ? colorOptions.map((colorOption, index) => {
          for (let i = quantityOptions.length - 1; i >= 0; i--) {
            if (
              quantityOptions[i].sizeId === this.state.quantityOption.sizeId &&
              quantityOptions[i].colorId === colorOption._id
            )
              return (
                <Tooltip
                  key={colorOption._id}
                  placement="top"
                  title={colorOption.color}
                >
                  <span
                    className={
                      "color" +
                      (quantityOption.colorId === colorOption._id
                        ? " check"
                        : "")
                    }
                    onClick={() => {
                      this.onChangeType("colorId", colorOption._id);
                    }}
                  >
                    <span>
                      <img alt="product" src={colorOption.image} />
                    </span>
                  </span>
                </Tooltip>
              );
          }
          return "";
        })
      : "";

    let price = this.props.price;
    let saleOff = this.props.saleOff;
    let index = findIndexById(sizeOptions, this.state.quantityOption.sizeId);
    let size = index !== -1 ? sizeOptions[index].size : "";
    index = findIndexById(colorOptions, this.state.quantityOption.colorId);
    let color = index !== -1 ? colorOptions[index].color : "";

    let { message, updateTypeLoading } = this.props.cartsReducer;

    return (
      <div className="dialog-change-type-cart">
        <div className="dialog">
          <div className="sizes">
            <h6 className="">Kích cỡ: {size}</h6>
            <div className="">{chooseSizes}</div>
          </div>
          <div className="colors">
            <h6 className="">Màu sắc: {color}</h6>
            <div className="">{Choosecolors}</div>
          </div>
          <div className="quantity-section">
            <h6 className="">Số lượng:</h6>
            <div className="">
              <button
                className="button-up-down btn-down"
                onClick={this.onDown}
                type="button"
              >
                -
              </button>
              <input
                className="input-numberic"
                readOnly
                type="number"
                value={this.state.quantity}
              />
              <button
                className="button-up-down btn-up"
                onClick={this.onUp}
                type="button"
              >
                +
              </button>
            </div>
            <span className="message">
              {this.state.quantityOption.quantity} Sản phẩm có sẵn
            </span>
          </div>
          <div className="price-section">
            <h6 className="">
              Giá:
              <span>
                {saleOff !== 0 ? (
                  <span className="orgin-price">
                    {" "}
                    <del>{convertNumberToVND(price)}₫</del>
                  </span>
                ) : (
                  ""
                )}
                <span className="price">
                  {" "}
                  {convertNumberToVND(price - saleOff)}₫
                </span>
              </span>
            </h6>
          </div>
          <div className="btn-section">
            {updateTypeLoading ? (
              <button className="btn-update">Cập nhật</button>
            ) : (
              <button onClick={this.onUpdateType} className="btn-update">
                Cập nhật
              </button>
            )}
            <button onClick={this.props.onClose} className="btn-close">
              Thoát
            </button>
          </div>
          {message ? (
            <div className="mr-t-15">
              <span className="text-danger">{message}</span>
            </div>
          ) : null}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    productOptionsReducer: state.productOptionsReducer,
    cartsReducer: state.cartsReducer,
  };
};

const mapDispatchToProps = (dispatch) => ({
  fectchQuantityOptions: (_id) => {
    dispatch(fectchQuantityOptionsRequest(_id));
  },
  fectchColorOptions: (_id) => {
    dispatch(fectchColorOptionsRequest(_id));
  },
  fectchSizeOptions: (_id) => {
    dispatch(fectchSizeOptionsRequest(_id));
  },
  updateTypeCart: (data) => {
    dispatch(updateTypeCartRequest(data));
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(memo(DialogChangeTypeInCart));
