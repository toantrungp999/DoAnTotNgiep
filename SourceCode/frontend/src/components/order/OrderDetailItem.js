import React, { Component, memo } from "react";
import { convertNumberToVND } from "./../../extentions/ArrayEx";
import "./Order.css";
import "./OrderDetailItem.css";

class OrderDetailItem extends Component {
  render() {
    const { orderDetail, showInstore } = this.props;
    return (
      <div className="order-detail-item-section">
        <div className="image">
          <img className="" alt={orderDetail.name} src={orderDetail.image} />
        </div>
        <div className="info">
          <div className="name">{orderDetail.name}</div>
          <div className="color-size-quantity">
            <div className="color-size">
              {orderDetail.color + " - " + orderDetail.size}
            </div>
            <div className="quantity">x{orderDetail.quantity}</div>
          </div>
          {showInstore && (
            <div className="quantity-instore">
              Kho: {orderDetail.quantityId.quantity}
            </div>
          )}
          <div className="price">{convertNumberToVND(orderDetail.price)}₫</div>
        </div>
      </div>
    );
  }
}

export default memo(OrderDetailItem);
