import React, { Component, memo } from "react";
import { connect } from "react-redux";
import $ from "jquery";
import {
  closeMessage,
  sendMessageToBot,
  sendMessageToUser,
  fectchMessagesRequest,
  updateMessengerCheck,
} from "../../actions/messengerActions";
import MessageItem from "./MessageItem";
import { BOT_ID } from "./../../constants/MessengerData";

class DetailMessage extends Component {
  state = {
    index: -1,
    content: "",
    lengthMessages: 0,
    currentPage: 1,
    pageSize: 7,
    theposition: window.pageYOffset,
    firstFetch: false,
  };

  constructor(props) {
    super(props);
    this.escFunction = this.escFunction.bind(this);
  }

  onChange = (e) => {
    const target = e.target;
    const name = target.name;
    let value = target.value;
    this.setState({
      [name]: value,
    });
  };

  isBottom(el) {
    return el.getBoundingClientRect().bottom <= window.innerHeight;
  }

  componentWillUnmount() {
    document.removeEventListener("scroll", this.handleScroll);
    document.removeEventListener("keydown", this.escFunction, false);
  }

  escFunction(event) {
    if (event.keyCode === 27) {
      this.props.closeMessage();
    }
  }

  handleScroll = (e) => {
    if (this.div.scrollTop !== null && this.div.scrollTop === 0) {
      const { loading } = this.props.messengersReducer;
      const { pagingInfo } =
        this.props.messengersReducer.messengers[this.props.index];
      if (
        pagingInfo &&
        loading === false &&
        pagingInfo.currentPage < pagingInfo.totalPage
      ) {
        this.props.fectchMessages(
          this.props.messengersReducer.messengers[this.props.index]._id,
          this.state.pageSize,
          this.state.currentPage + 1
        );
        this.setState({ currentPage: this.state.currentPage + 1 });
      }
    }
  };

  onSend = () => {
    const { userId } = this.props;
    const { messengers } = this.props.messengersReducer;
    const isCustomerCare =
      (!messengers[this.props.index].user1 ||
        messengers[this.props.index].user1._id !== userId) &&
      (!messengers[this.props.index].user2 ||
        messengers[this.props.index].user2._id !== userId);

    const content = this.state.content.trim();
    if (
      content &&
      this.props.to &&
      this.props.to._id === BOT_ID &&
      !isCustomerCare
    )
      this.props.sendMessageToBot(content);
    else if (content)
      this.props.sendMessageToUser(
        this.props.to ? this.props.to._id : null,
        content,
        isCustomerCare
      );
    this.setState({ content: "" });
  };

  componentDidUpdate(prevProps) {
    if (
      prevProps.messengersReducer !== this.props.messengersReducer &&
      this.props.messengersReducer.loading === false
    ) {
      const index = this.props.index;
      let lengthMessageCurrent = 0;
      if (index > -1)
        lengthMessageCurrent =
          this.props.messengersReducer.messengers[index].messages.length;
      let distance = (lengthMessageCurrent - this.state.lengthMessages) * 25;
      if (distance > 0) {
        if (distance === 25 || this.state.firstFetch === true) {
          let objMessage = $(".body-detail-meesenger");
          objMessage.animate({ scrollTop: objMessage.prop("scrollHeight") }, 1);
          this.setState({ firstFetch: false });
        } else this.div.scrollTop += distance;
        this.setState({ lengthMessages: lengthMessageCurrent });
      }

      if (
        this.props.index !== this.state.index &&
        this.props.messengersReducer.messengers[this.props.index]
          .fetchMessages === false
      ) {
        this.setState({ index: this.props.index, currentPage: 1, pageSize: 7 });
        this.props.fectchMessages(
          this.props.messengersReducer.messengers[this.props.index]._id,
          7,
          1
        );
      }
    }
  }

  componentDidMount() {
    document.addEventListener("keydown", this.escFunction, false);
    this.setState({ index: this.props.index });
    this.div.addEventListener("scroll", this.handleScroll);
    if (this.props.index > -1) {
      const { messengers } = this.props.messengersReducer;
      if (messengers[this.props.index].fetchMessages === false) {
        this.props.fectchMessages(
          messengers[this.props.index]._id,
          this.state.pageSize,
          this.state.currentPage
        );
        this.setState({ firstFetch: true });
      }

      const lengthMessages = messengers[this.props.index].messages.length;
      if (lengthMessages > 0) {
        this.setState({ lengthMessages });
        let objMessage = $(".body-detail-meesenger");
        objMessage.animate({ scrollTop: objMessage.prop("scrollHeight") }, 1);
      }
    }
  }

  handleKeyPress = (e) => {
    if (e.charCode === 13) this.onSend();
  };

  onChecked = () => {
    const { messengers } = this.props.messengersReducer;
    if (messengers[this.props.index].check === false) {
      const currentUserSend =
        messengers[this.props.index].user1._id === this.props.userId
          ? "user1"
          : "user2";
      const isMeSend =
        currentUserSend ===
        messengers[this.props.index].messages[
          messengers[this.props.index].messages.length - 1
        ].sender;
      if (!isMeSend) updateMessengerCheck(messengers[this.props.index]._id);
    }
  };

  render() {
    const { messengers } = this.props.messengersReducer;

    const imageHref = !this.props.to ? "/CSKH.jpg" : this.props.to.image;
    const messages =
      messengers && this.props.index > -1
        ? messengers[this.props.index].messages
        : null;
    const messageItems = [];

    if (messages) {
      const currentUser =
        messengers[this.props.index].user1._id === this.props.userId
          ? "user1"
          : "user2";
      let showImage = false;
      const total = messages.length;
      for (let i = 0; i < total; i++) {
        let isReciver = false;
        if (currentUser !== messages[i].sender) {
          isReciver = true;
          if (
            i + 1 === total ||
            (i + 1 < total && currentUser === messages[i + 1].sender)
          )
            showImage = true;
          else showImage = false;
        } else showImage = false;
        messageItems.push(
          <MessageItem
            imageHref={imageHref}
            isReciver={isReciver}
            showImage={showImage}
            index={i}
            key={i}
            message={messages[i]}
          />
        );
      }
    }

    return (
      <div className="messenger-from">
        <div className="messenger-box">
          <div className="row message-title detail-meesenger-header">
            <div className="col-10">
              <div className="row">
                <img
                  alt="avatar-meesenger-header"
                  className="avatar-meesenger-header"
                  src={imageHref}
                />
                <div className="name-meesenger-header">
                  {!this.props.to ? "Chăm sóc khách hàng" : this.props.to.name}
                </div>
              </div>
            </div>
            <div className="col-2">
              <i
                onClick={this.props.closeMessage}
                className="exit-meesage-from fas fa-times"
              ></i>
            </div>
          </div>
          <div
            className="body-detail-meesenger"
            ref={(div) => (this.div = div)}
          >
            {messageItems}
          </div>
          <div className="row type-message">
            <div style={{ width: "87%", marginLeft: "12px" }}>
              <div className="form-group" style={{ marginBottom: "8px" }}>
                <input
                  onKeyPress={this.handleKeyPress}
                  onClick={this.onChecked}
                  className="form-control"
                  value={this.state.content}
                  name="content"
                  onChange={this.onChange}
                  type="text"
                  placeholder="Nhập nội dung"
                />
              </div>
            </div>
            <div style={{ width: "5%", marginLeft: "8px" }}>
              <i
                onClick={this.onSend}
                className="send-message-icon fas fa-paper-plane"
              ></i>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    messengersReducer: state.messengersReducer,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    fectchMessages: (mesengerId, pageSize, currentPage) =>
      dispatch(fectchMessagesRequest(mesengerId, pageSize, currentPage)),
    closeMessage: () => dispatch(closeMessage()),
    sendMessageToBot: (content) => dispatch(sendMessageToBot(content)),
    sendMessageToUser: (to, content, isCustomerCare) =>
      dispatch(sendMessageToUser(to, content, isCustomerCare)),
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(memo(DetailMessage));
