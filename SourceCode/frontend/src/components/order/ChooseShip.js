import React, { Component, memo } from "react";
import { CloseOutlined } from "@ant-design/icons";
import { convertNumberToVND, getStringDate } from "../../extentions/ArrayEx";
import { Loading3QuartersOutlined } from "@ant-design/icons";

import "./ChooseShip.css";

class ChooseShip extends Component {
  state = {
    closing: false,
  };
  onClosing = (e) => {
    e.preventDefault();
    this.setState({ closing: true });
    setTimeout(() => {
      this.props.closeChooseShip();
    }, 200);
  };

  onChooseShip = (e, index) => {
    e.preventDefault();
    this.props.onChooseShip(index);
    this.onClosing(e);
  };

  render() {
    const { shipInfos, shipId } = this.props;
    const shipOptions =
      shipInfos === null ? (
        <Loading3QuartersOutlined spin />
      ) : shipInfos === "fail" ? (
        <div>Thất bại, vui lòng thử lại sau</div>
      ) : (
        shipInfos.map((info, index) => {
          return (
            <div
              key={index}
              className={
                "ship-option" + (Number(shipId) === index ? " active" : "")
              }
              onClick={(e) => {
                this.onChooseShip(e, index);
              }}
            >
              <div className="ship-brand">{info.name}</div>
              <div className="ship-info">
                <div className="ship-fee">
                  {convertNumberToVND(info.shippingFee)}₫
                </div>
                <div className="receiveDate">
                  Nhận {getStringDate(info.date * 1000)}
                </div>
              </div>
            </div>
          );
        })
      );
    return (
      <div
        className={
          "dialog-black-backgound" + (this.state.closing ? " closing" : "")
        }
        onClick={this.onClosing}
      >
        <div className="choose-ship-section">
          <div className="dialog-name">Chọn hình thức giao hàng</div>
          {shipOptions}
          <CloseOutlined className="close-button" onClick={this.onClosing} />
        </div>
      </div>
    );
  }
}

export default memo(ChooseShip);
