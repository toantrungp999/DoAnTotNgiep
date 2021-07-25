import React, { Component } from "react";
import ProductItem from "../productIem/ProductItem";
import { Link } from "react-router-dom";
import "./ProductSection.css";

class ProductSection extends Component {
  render() {
    const { products, title, description, colorOptions, sizeOptions, path } =
      this.props;
    let _products = products && products.slice(0, 8);
    let productElements = _products
      ? _products.map((product, index) => {
          return (
            <ProductItem
              key={product._id}
              index={index}
              product={product}
              colorOptions={colorOptions}
              sizeOptions={sizeOptions}
            />
          );
        })
      : "";
    return (
      <div className="product-section-component">
        <div className="title">
          <span>
            <Link className={path ? "" : "disable"} to={path}>
              {title}
            </Link>
          </span>
        </div>
        <div className="description">{description}</div>
        <div className="products">{productElements}</div>
      </div>
    );
  }
}

export default ProductSection;
