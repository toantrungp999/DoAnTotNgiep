import React, { Component, memo } from "react";
import { convertNumberToVND, findIndexById } from "../../../extentions/ArrayEx";
import { Link } from "react-router-dom";
import { Tooltip } from "antd";
import "./ProductOption.css";

class ProductOption extends Component {
  constructor(props) {
    super(props);
    this.state = {
      colorId: "",
      sizeId: "",
      quantityOption: "",
      quantity: 1,
    };
  }

  onAddCart = (e) => {
    e.preventDefault();
    let { colorId, sizeId, quantity } = this.state;
    this.props.onAddCart({
      colorId,
      sizeId,
      quantity,
    });
  };

  onBuy = (e) => {
    e.preventDefault();
    let { colorId, sizeId, quantity } = this.state;
    this.props.onBuy({
      colorId,
      sizeId,
      quantity,
    });
  };

  onChange = (e) => {
    const target = e.target;
    const name = target.name;
    let value = target.value;
    if (name === "quantity") {
      value = value.replace(".", "");
      value = value.replace(",", "");
    }
    this.setState({
      [name]: value,
    });
  };

  onChangeOption = (name, value) => {
    if (name === "color") {
      this.setState({ colorId: value });
      let { colorOptions } = this.props.productOptionsReducer;
      let index = findIndexById(colorOptions, value);
      if (index >= 0) this.props.onShowColorImage(index);
    } else if (name === "size") {
      this.setState({ sizeId: value });
    }
  };

  onChangeQuantity = (event) => {
    event.preventDefault();
    const name = event.target.name;
    let quantity = this.state.quantity;
    if (name === "minus") {
      quantity = quantity >= 2 ? Number(quantity) - 1 : 1;
    } else {
      quantity = quantity <= 4 ? Number(quantity) + 1 : 5;
    }
    this.setState({ quantity });
  };

  componentDidMount() {
    const { colorOptions, sizeOptions } = this.props.productOptionsReducer;

    this.setState({
      colorId: colorOptions && colorOptions[0] ? colorOptions[0]._id : null,
      sizeId: sizeOptions && sizeOptions[0] ? sizeOptions[0]._id : null,
    });
  }

  componentDidUpdate(prevProps) {
    if (prevProps.productOptionsReducer !== this.props.productOptionsReducer) {
      const { colorOptions, sizeOptions } = this.props.productOptionsReducer;

      this.setState({
        colorId: colorOptions && colorOptions[0] ? colorOptions[0]._id : null,
        sizeId: sizeOptions && sizeOptions[0] ? sizeOptions[0]._id : null,
      });
    }
  }

  render() {
    const { colorOptions, sizeOptions, quantityOptions } =
      this.props.productOptionsReducer;
    const active =
      colorOptions &&
      colorOptions.length > 0 &&
      sizeOptions &&
      sizeOptions.length > 0 &&
      quantityOptions &&
      quantityOptions.length > 0
        ? true
        : false;

    const { colorId, sizeId, quantity } = this.state;
    const { categoryId, price, saleOff } = this.props;
    var size;
    const chooseSizes = sizeOptions
      ? sizeOptions.map((sizeOption, index) => {
          if (sizeOption._id === sizeId) {
            size = sizeOption.size;
          }
          return (
            <button
              key={sizeOption._id}
              className={sizeId === sizeOption._id ? "active" : ""}
              name="size"
              id={sizeOption._id}
              index={index}
              onClick={() => {
                this.onChangeOption("size", sizeOption._id);
              }}
            >
              {sizeOption.size}
            </button>
          );
        })
      : "";
    var color;
    const choosecolors = colorOptions
      ? colorOptions.map((colorOption, index) => {
          if (colorOption._id === colorId) color = colorOption.color;
          return (
            <Tooltip
              key={colorOption._id}
              className="tool-tip"
              placement="top"
              title={colorOption.color}
            >
              <button
                className={colorId === colorOption._id ? "active" : ""}
                name="color"
                id={colorOption._id}
                index={index}
                onClick={() => {
                  this.onChangeOption("color", colorOption._id);
                }}
              >
                <img alt="product-color" src={colorOption.image} />
              </button>
            </Tooltip>
          );
        })
      : "";

    let quantityOption = null;
    if (quantityOptions) {
      for (let i = quantityOptions.length - 1; i >= 0; i--) {
        if (
          quantityOptions[i].sizeId === sizeId &&
          quantityOptions[i].colorId === colorId
        ) {
          quantityOption = quantityOptions[i];
          break;
        }
      }
    }

    const quantityInstore = quantityOption
      ? quantityOption.quantity > 0
        ? quantityOption.quantity
        : "Hết hàng"
      : "Hết hàng";

    return (
      <>
        <div className="price-section">
          {saleOff !== 0 && (
            <div className="product-origin-price">
              <del>{convertNumberToVND(price)}₫</del>
            </div>
          )}
          <div className="product-price">
            {convertNumberToVND(price - saleOff)}₫
          </div>
        </div>
        {choosecolors.length > 0 && (
          <div className="color-section">
            <div className="color">Màu sắc: {color}</div>
            <div className="color-options">{choosecolors}</div>
          </div>
        )}
        {chooseSizes.length > 0 && (
          <div className="size-section">
            <div className="size">Kích cỡ: {size}</div>
            <div className="size-options">{chooseSizes}</div>
          </div>
        )}
        {active && (
          <div className="store-quantity-section">
            <div className="store-quantity">Số lượng: {quantityInstore}</div>
          </div>
        )}
        {active ? (
          <div className="quantity-section">
            <div className="quantity">
              <button
                className="minus"
                name="minus"
                onClick={this.onChangeQuantity}
              ></button>
              <input
                name="quantity"
                value={quantity}
                onChange={this.onChange}
              ></input>
              <button
                className="plus"
                name="plus"
                onClick={this.onChangeQuantity}
              ></button>
            </div>
            <div className="break"></div>
            {this.props.createLoading ? (
              <button className="add-to-cart-btn">Thêm vào giỏ hàng</button>
            ) : (
              <button className="add-to-cart-btn" onClick={this.onAddCart}>
                Thêm vào giỏ hàng
              </button>
            )}
            <div className="break"></div>
            {this.props.createLoading ? (
              <button className="buy-now-btn">Mua ngay</button>
            ) : (
              <button className="buy-now-btn" onClick={this.onBuy}>
                Mua ngay
              </button>
            )}
          </div>
        ) : (
          <div className="comming-soon">Sản phẩm sắp mở bán</div>
        )}
        <div className="category-section">
          <span className="category">Loại: </span>
          <Link to={`/category-group?key=${categoryId.categoryGroupId._id}`}>
            {categoryId.categoryGroupId.name}
          </Link>
          ,<Link to={`/category?key=${categoryId._id}`}>{categoryId.name}</Link>
        </div>
      </>
    );
  }
}

export default memo(ProductOption);
