import React, { Component } from "react";
import "./ConfirmDialog.css";
class ConfirmDialog extends Component {
  render() {
    return (
      <div className="dialog-bg confirm-dialog" onClick={this.props.onClose}>
        <div className="dialog-container">
          <h5 className="dialog-title">Cảnh báo</h5>
          <p className="dialog-message">{this.props.message}</p>
          <div className="dialog-btns">
            <button className="btn-confirm" onClick={this.props.onConfirm}>
              Xác nhận
            </button>
            <button className="btn-close" onClick={this.props.onClose}>
              Thoát
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default ConfirmDialog;
