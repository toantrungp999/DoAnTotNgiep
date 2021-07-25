import React, { Component, memo } from "react";
import * as CancelReasons from "../../constants/CancelReasons";
import Select from "../common/formField/Select";
import Input from "../common/formField/Input";
import "./CancelOrderDialog.css";

class CancelOrderDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      reason: "",
      otherReason: "",
      firstSubmit: false,
    };
  }

  onChange = (event) => {
    var { name, value } = event.target;
    switch (name) {
      case "reason":
        if (value === CancelReasons.BY_ADMIN.OTHER)
          this.setState({ otherReason: "" });
        break;
      default:
    }
    this.setState({
      [name]: value,
    });
  };

  onConfirm = () => {
    var { reason, otherReason } = this.state;
    if (reason !== "") {
      var cancelReason = this.props.isAdminSide
        ? "Người bán: "
        : "Khách hàng: ";
      if (reason === CancelReasons.BY_ADMIN.OTHER && otherReason.length < 100) {
        cancelReason += otherReason;
      } else {
        cancelReason += reason;
      }
      this.props.onConfirmCancel(cancelReason);
    }
    this.setState({ firstSubmit: true });
  };

  onClose = (e) => {
    e.preventDefault();
    this.props.onCloseCancelDialog();
  };

  render() {
    var { firstSubmit } = this.state;
    let reasons;
    let reasonOptions = [];
    if (this.props.isAdminSide === true) {
      reasons = CancelReasons.BY_ADMIN;
    } else {
      reasons = CancelReasons.BY_CUSTOMER;
    }

    for (const [index, value] of Object.entries(reasons)) {
      console.log(index);
      reasonOptions.push({ value: value, label: value });
    }
    console.log(this.state.reason);

    return (
      <div className="cancel-order-dialog">
        <div className="dialog-bg" onClick={this.onClose}></div>
        <div
          className="cancel-order-dialog-container"
          onClick={(e) => e.preventDefault()}
        >
          <h5 className="dialog-title">Xác nhận hủy đơn hàng</h5>
          <div>
            <Select
              name="reason"
              value={this.state.reason}
              firstSubmit={firstSubmit}
              label="Lý do"
              labelWidth=""
              vertical={true}
              placeHolder="Chọn lý do"
              setValidate={this.setValidate}
              onChange={this.onChange}
              rules={[{ require: true, message: "Chưa chọn" }]}
              options={reasonOptions}
            />
            {this.state.reason === CancelReasons.BY_ADMIN.OTHER ? (
              <>
                <Input
                  name="otherReason"
                  value={this.state.otherReason}
                  firstSubmit={firstSubmit}
                  label="Lý do khác"
                  labelWidth=""
                  vertical={true}
                  setValidate={this.setValidate}
                  onChange={this.onChange}
                  placeHolder="Nhập lý do"
                  rules={[{ max: 255, message: "Nhập dưới 255 ký tự" }]}
                />
              </>
            ) : (
              ""
            )}
          </div>
          <div className="btn-section">
            <button className="btn-close" onClick={this.onClose}>
              Trở lại
            </button>
            <button className="btn-confirm" onClick={this.onConfirm}>
              Hủy đơn hàng
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default memo(CancelOrderDialog);
