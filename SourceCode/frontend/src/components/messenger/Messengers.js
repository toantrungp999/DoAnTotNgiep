import React, { Component, memo } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import {
  createNewMessage,
  openDetailMessenger,
} from "../../actions/messengerActions";
import MessengerItem from "./MessengerItem";
import "./styles/MessengerStyle.css";
import { removeVietnameseTones } from "../../extentions/ArrayEx";

class Messengers extends Component {
  state = { viewMessengers: false, search: "" };

  createNewMessage = () => {
    this.props.onViewMessengers();
    this.props.createNewMessage();
  };

  openDetailMessenger = (index, to) => {
    this.props.openDetailMessenger(index, to);
    this.props.onViewMessengers();
  };

  onChange = (e) => {
    const target = e.target;
    const name = target.name;
    let value = target.value;
    this.setState({
      [name]: value,
    });
  };

  render() {
    const { messengers } = this.props.messengersReducer;
    const { userInfo } = this.props.userInfoReducer;
    let notSeen = 0;

    const search = removeVietnameseTones(this.state.search.toLowerCase().trim());

    const messengerItems = messengers
      ? messengers.map((messenger, index) => {
          let currentUserSend =
            messenger.user1._id === userInfo._id ? "user1" : "user2";
          let isMeSend =
            currentUserSend ===
            messenger.messages[messenger.messages.length - 1].sender;
          if (!isMeSend && messenger.check === false) notSeen++;

          return (
            <MessengerItem
              currentUserSend={currentUserSend}
              isMeSend={isMeSend}
              openDetailMessenger={this.openDetailMessenger}
              index={index}
              key={messenger._id}
              messenger={messenger}
              userId={userInfo._id}
              search={search}
            />
          );
        })
      : null;

    return (
      <div>
        <Link
          to="#"
          onClick={(e) => {
            e.preventDefault();
            this.props.onViewMessengers();
          }}
          className="nav-link messenger"
        >
          <i className="fab icon fa-facebook-messenger"></i>
          {notSeen !== 0 ? <span className="num">{notSeen}</span> : null}
        </Link>
        {this.props.viewMessengers ? (
          <div className="messengers-dialog">
            <div className="row">
              <div className="col-10">
                <h4 style={{ margin: "5px" }}>Tin nhắn</h4>
              </div>
              <div className="col-2">
                <i
                  className="messenger-create-message far fa-edit"
                  onClick={this.createNewMessage}
                ></i>
              </div>
            </div>

            <div
              className="row"
              style={{ marginBottom: "10px", marginTop: "10px" }}
            >
              <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                <div className="form-group">
                  <input
                    className="form-control search-messenger"
                    name="search"
                    onChange={this.onChange}
                    type="text"
                    placeholder="Tìm kiếm"
                  />
                </div>
              </div>
            </div>
            {messengerItems}
          </div>
        ) : null}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    userInfoReducer: state.userInfoReducer,
    messengersReducer: state.messengersReducer,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    createNewMessage: () => dispatch(createNewMessage()),
    openDetailMessenger: (index, to) =>
      dispatch(openDetailMessenger(index, to)),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(memo(Messengers));
