import React, { Component, memo } from "react";
import { removeVietnameseTones, time_ago } from "../../extentions/ArrayEx";

class MessengerItem extends Component {
  render() {
    const { messenger, userId, isMeSend } = this.props;

    const isMessengerItemToAdmin =
      (!messenger.user1 || messenger.user1._id !== userId) &&
      (!messenger.user2 || messenger.user2._id !== userId)
        ? true
        : false;
    let image = null,
      name = null;
    if (isMessengerItemToAdmin) {
      image = messenger.user1?.image || messenger.user2.image;
      name = messenger.user1?.name || messenger.user2.name;
    } else {
      image =
        !messenger.user1 || !messenger.user2
          ? ""
          : messenger.user1._id === userId
          ? messenger.user2.image
          : messenger.user1.image;
      name =
        !messenger.user1 || !messenger.user2
          ? "Chăm sóc khác hàng"
          : messenger.user1._id === userId
          ? messenger.user2.name
          : messenger.user1.name;
    }

    if (
      !this.props.search ||
      removeVietnameseTones(name.toLowerCase()).includes(this.props.search)
    )
      return (
        <div
          className="row messenger-item"
          onClick={() =>
            this.props.openDetailMessenger(
              this.props.index,
              messenger.user1._id === userId ? messenger.user2 : messenger.user1
            )
          }
        >
          <div style={{ width: "20%" }}>
            {isMessengerItemToAdmin ? (
              <img
                alt="messenger-avatar"
                className="messenger-avatar"
                src={image}
              ></img>
            ) : (
              <img
                alt="messenger-avatar"
                className="messenger-avatar"
                src={image || "/CSKH.jpg"}
              ></img>
            )}
          </div>
          <div
            className="messenger-content"
            style={
              !isMeSend && messenger.check === false
                ? { fontWeight: "bold" }
                : {}
            }
          >
            <div>
              {isMessengerItemToAdmin ? (
                <div>
                  <span className="messenger-user-name">{name}</span>
                  <span className="is-system">Tin nhắn hệ thống</span>
                </div>
              ) : (
                <span className="messenger-user-name">{name}</span>
              )}
            </div>
            <div>
              <span className="messenger-message">
                <span>
                  {isMeSend ? "Bạn: " : ""}
                  {
                    messenger.messages[messenger.messages.length - 1].content
                      .msg
                  }
                </span>
                <span> · </span>
                <span>{time_ago(messenger.date)}</span>
              </span>
            </div>
          </div>
        </div>
      );
    else return null;
  }
}

export default memo(MessengerItem);
