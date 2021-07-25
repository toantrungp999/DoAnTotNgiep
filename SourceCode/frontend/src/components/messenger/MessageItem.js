import React, { Component, memo } from "react";

class MessageItem extends Component {
  render() {
    return (
      <>
        {this.props.isReciver ? (
          <div className="row meesenger-content-recive">
            <div style={{ width: "12%", position: "relative" }}>
              {this.props.showImage ? (
                <img
                  alt="avatar-meesenger-content"
                  className="avatar-meesenger-content"
                  src={this.props.imageHref}
                />
              ) : null}
            </div>
            <div style={{ width: "72%", marginTop: "4px" }}>
              <div className="meesenger-content-recive-value">
                {this.props.message.content.msg}
                {this.props.message.content.listData}
              </div>
            </div>
          </div>
        ) : (
          <div className="row meesenger-content-send">
            <div style={{ width: "94%" }}>
              <div className="meesenger-content-send-value">
                {this.props.message.content.msg}
              </div>
            </div>{" "}
          </div>
        )}
      </>
    );
  }
}

export default memo(MessageItem);
