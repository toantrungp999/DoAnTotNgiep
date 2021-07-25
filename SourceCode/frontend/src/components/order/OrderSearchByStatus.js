import React, { Component, memo } from "react";
import * as OrderStatuses from "../../constants/OrderStatuses";
import "./OrderSearchByStatus.css";
class OrderSearchByStatus extends Component {
  onSwitchStatus = (status) => {
    this.props.onSwitchStatus(status);
  };

  render() {
    let statusBar = [];
    statusBar.push(
      <button
        key={-1}
        type="button"
        className={this.props.currentStatus === "Tất cả" ? "active" : ""}
        onClick={() => this.onSwitchStatus("Tất cả")}
      >
        Tất cả
      </button>
    );
    for (const [index, value] of Object.entries(OrderStatuses)) {
      let active = this.props.currentStatus === value ? "active" : "";
      var dislayValue;
      switch (value) {
        case "Đang giao hàng":
          dislayValue = "Đang giao";
          break;
        case "Đã nhận hàng":
          dislayValue = "Đã nhận";
          break;
        case "Giao hàng thất bại":
          dislayValue = "Thất bại";
          break;
        default:
          dislayValue = value;
          break;
      }
      statusBar.push(
        <button
          key={index}
          className={active}
          type="button"
          onClick={() => this.onSwitchStatus(value)}
        >
          {dislayValue}
        </button>
      );
    }

    return (
      <>
        <ul className="order-search-by-status">{statusBar}</ul>
      </>
    );
  }
}

export default memo(OrderSearchByStatus);
