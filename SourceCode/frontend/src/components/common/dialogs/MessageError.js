import React, { Component } from "react";
import { WarningTwoTone } from "@ant-design/icons";
import "./MessageSuccess.css";

class MessageError extends Component {
  state = {
    closing: false,
  };

  onClose = () => {
    this.setState({ closing: true });
    setTimeout(() => this.props.onClose(), 300);
  };

  render() {
    return (
      <div
        className={
          "message-success-container" + (this.state.closing ? " closing" : "")
        }
        onClick={this.onClose}
      >
        <div className="message-box">
          <WarningTwoTone className="check-icon" twoToneColor="#ff0000" />
          <div className="message">{this.props.message}</div>
        </div>
      </div>
    );
  }
}

export default MessageError;
