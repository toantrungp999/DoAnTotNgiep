import React, { Component } from "react";
import { CheckCircleTwoTone } from "@ant-design/icons";
import "./MessageSuccess.css";
class MessageSuccess extends Component {
  state = {
    closing: false,
  };
  componentDidMount() {
    setTimeout(() => this.onClose(), 2000);
  }

  onClose = () => {
    this.setState({ closing: true });
    setTimeout(() => this.props.onOkay(), 300);
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
          <CheckCircleTwoTone className="check-icon" twoToneColor="#00db00" />
          <div className="message">{this.props.message}</div>
        </div>
      </div>
    );
  }
}

export default MessageSuccess;
