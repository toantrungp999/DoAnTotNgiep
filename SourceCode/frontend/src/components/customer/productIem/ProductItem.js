import React, { Component, memo } from "react";
import { Link } from "react-router-dom";
import { convertNumberToVND } from "../../../extentions/ArrayEx";
import { Tooltip } from "antd";
import "./ProductItem.css";

class ProductItem extends Component {
  state = {
    colorOptions: null,
    image: null,
    colorHover: false,
    sizeOptions: null,
  };
  addProductToCart = (e) => {
    e.preventDefault();
  };

  componentDidMount = () => {
    const { _id } = this.props.product;
    const { colorOptions, sizeOptions } = this.props;
    const _colorOptions = [];
    for (let i = 0; i < colorOptions.length; i++) {
      if (
        _id === colorOptions[i].productId &&
        !colorOptions.includes(colorOptions[i].image)
      )
        _colorOptions.push({
          _id: colorOptions[i]._id,
          image: colorOptions[i].image,
          color: colorOptions[i].color,
        });
    }
    const _sizeOptions = [];
    for (let i = 0; i < sizeOptions.length; i++) {
      if (
        _id === sizeOptions[i].productId &&
        !sizeOptions.includes(sizeOptions[i].image)
      )
        _sizeOptions.push({
          _id: sizeOptions[i]._id,
          size: sizeOptions[i].size,
        });
    }
    if (colorOptions.length > 0)
      this.setState({ colorOptions: _colorOptions, sizeOptions: _sizeOptions });
  };

  onMouseEnter = (e, image) => {
    e.preventDefault();
    this.setState({ image, colorHover: true });
  };

  onMouseLeave = () => {
    this.setState({ colorHover: false });
  };

  render() {
    const { _id, name, price, saleOff, numberRate, avgRate } =
      this.props.product;
    const { colorOptions, sizeOptions } = this.state;
    let images = this.props.product.images;

    const imagesComponent =
      colorOptions?.map((color) => {
        images.push(color.image);
        return (
          <Tooltip
            key={color._id}
            className="tool-tip"
            placement="top"
            title={color.color}
          >
            <div
              className="color-img-container"
              onMouseEnter={(e) => {
                this.onMouseEnter(e, color.image);
              }}
              onMouseLeave={this.onMouseLeave}
            >
              <img alt="product" src={color.image} />
            </div>
          </Tooltip>
        );
      }) || null;

    const sizesComponent =
      sizeOptions?.map((size) => {
        return <span key={size._id}>{size.size}</span>;
      }) || null;

    return (
      <div className="product-item-section">
        <Link className="link-detail" to={`/detail/${_id}`}>
          <div
            className={
              "img-section" + (this.state.colorHover ? " color-hover" : "")
            }
          >
            <div className="main-img">
              <img src={images?.[0] || null} alt={name} />
            </div>
            <div className="color-img">
              <img src={this.state.image} alt="" />
            </div>
            <div className="sizes-section">{sizesComponent}</div>
            {/* <button onClick={this.addProductToCart}><i className="fas fa-cart-plus"></i></button> */}
            {saleOff !== 0 ? (
              <div className="sale-off-icon">
                -{Math.ceil(100 - ((price - saleOff) / price) * 100)}%
              </div>
            ) : (
              ""
            )}
          </div>
          <div className="more-info-section">
            <div className="more-info-img1">
              <img src={images[1]} alt={name} />
            </div>
            <div className="more-info-img23-container">
              <div className="more-info-img2">
                <img src={images[2]} alt={name} />
              </div>
              <div className="more-info-img3">
                <img src={images[3]} alt={name} />
              </div>
            </div>
            <div className="more-info-img4">
              <img src={images[4]} alt={name} />
            </div>
          </div>
        </Link>
        <div className="body-section">
          <Link className="link-detail" to={`/detail/${_id}`}>
            <div className="title">{name}</div>
          </Link>

          <div className="price-section">
            {saleOff !== 0 ? (
              <del className="saleOff">{convertNumberToVND(price)}₫</del>
            ) : (
              ""
            )}
            <span className="price">
              {convertNumberToVND(price - saleOff)}₫
            </span>
          </div>
          {avgRate && numberRate > 0 ? (
            <div className="rate">
              <span> ({numberRate})</span>
              <input
                defaultChecked={avgRate === 5}
                id="rate5"
                type="radio"
                className="star"
                value="5"
              />
              <label htmlFor="rate5" title="text">
                5 stars
              </label>
              <input
                defaultChecked={avgRate === 4}
                id="rate4"
                type="radio"
                className="star"
                value="4"
              />
              <label htmlFor="rate4" title="text">
                4 stars
              </label>
              <input
                defaultChecked={avgRate === 3}
                id="rate3"
                type="radio"
                className="star"
                value="3"
              />
              <label htmlFor="rate3" title="text">
                3 stars
              </label>
              <input
                defaultChecked={avgRate === 2}
                id="rate2"
                type="radio"
                className="star"
                value="2"
              />
              <label htmlFor="rate2" title="text">
                2 stars
              </label>
              <input
                defaultChecked={avgRate === 1}
                id="rate1"
                type="radio"
                className="star"
                value="1"
              />
              <label htmlFor="rate1" title="text">
                1 star
              </label>
            </div>
          ) : (
            ""
          )}
          <div className="color-imgs-section">{imagesComponent}</div>
        </div>
      </div>
    );
  }
}

export default memo(ProductItem);
