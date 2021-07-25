import React, { Component, memo } from "react";
import ProductItem from "../productIem/ProductItem";
import { Link } from "react-router-dom";
import ScrollMenu from "react-horizontal-scrolling-menu";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import "./RecommendedSection.css";

class RecommendedSection extends Component {
  render() {
    const { products, title, description, colorOptions, sizeOptions, path } =
      this.props;
    let _products = products && products.slice(0, 10);
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
    // let productElements=[];
    // for(var i=0; i<20; i++){
    //     productElements.push(<div>12312313 {i}</div>);
    // }
    const ArrowLeft = (
      <div className="arrow arrow-left">
        <LeftOutlined />
      </div>
    );
    const ArrowRight = (
      <div className="arrow arrow-right">
        <RightOutlined />
      </div>
    );

    return (
      <div className="recommended-section-component">
        <div className="title">
          <span>
            <Link className={path ? "" : "disable"} to={path}>
              {title}
            </Link>
          </span>
        </div>
        <div className="description">{description}</div>
        <div className="products">
          <ScrollMenu
            alignCenter={false}
            arrowLeft={ArrowLeft}
            arrowRight={ArrowRight}
            data={productElements}
            dragging={true}
            wheel={false}
          />
        </div>
      </div>
    );
  }
}

export default memo(RecommendedSection);
