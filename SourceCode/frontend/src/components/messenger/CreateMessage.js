import React, { Component, memo } from "react";
import { connect } from "react-redux";
import {
  closeMessage,
  sendMessageToUser,
  sendMessageToBot,
} from "../../actions/messengerActions";
import { fectchAllUsersRequest } from "../../actions/managerUsersActions";
import Select from "react-select";
import { CUSTOMER } from "../../constants/Roles";

class CreateMessage extends Component {
  state = {
    content: "",
    to: "bot",
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

  onSelected = (selectedOption) => {
    this.setState({ to: selectedOption.value });
  };

  componentDidMount() {
    document.addEventListener("keydown", this.escFunction, false);
    const { loading, users } = this.props.allUserReducer;
    if (!loading && !users) this.props.fectchAllUsers();
  }

  escFunction(event) {
    if (event.keyCode === 27) {
      this.props.closeMessage();
    }
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.escFunction, false);
  }

  onSend = () => {
    const content = this.state.content.trim();
    if (content) {
      if (this.state.to === "customerCare")
        this.props.sendMessageToUser(null, content);
      else if (this.state.to === "bot") this.props.sendMessageToBot(content);
      else this.props.sendMessageToUser(this.state.to, content);
      this.props.closeMessage();
    }
  };

  handleKeyPress = (e) => {
    console.log(e.charCode);
    if (e.charCode === 13) this.onSend();
  };

  render() {
    const options = [{ value: "bot", label: "Trợ lý ảo" }];

    if (this.props.role === CUSTOMER)
      options.push({ value: "customerCare", label: "Chăm sóc khách hàng" });

    const { users } = this.props.allUserReducer;
    if (users)
      for (let i = users.length - 1; i >= 0; i--) {
        options.push({ value: users[i]._id, label: users[i].name });
      }

    return (
      <div className="messenger-from">
        <div className="messenger-box">
          <div className="row message-title">
            <div className="col-10">
              <div style={{ fontWeight: "bold", marginLeft: "2px" }}>
                Tin nhắn mới
              </div>
            </div>
            <div className="col-2">
              <i
                onClick={this.props.closeMessage}
                className="exit-meesage-from fas fa-times"
              ></i>
            </div>
          </div>
          <div className="row message-to">
            <div className="col-1 text-to">
              <span className="label-to">Tới: </span>
            </div>
            <div className="col-10">
              <div className="form-group">
                {/* <select className="form-control" name="to" value={this.state.to} onChange={this.onChange}>
                                    <option value="bot">Trợ lý ảo</option>
                                    <option value="customerCare">Chăm sóc khách hàng</option>
                                </select> */}
                <Select
                  className="label-to"
                  onChange={this.onSelected}
                  placeholder="Tới"
                  options={options}
                  isSearchable={true}
                />
              </div>
            </div>
          </div>
          <div className="row type-message">
            <div style={{ width: "87%", marginLeft: "12px" }}>
              <div className="form-group" style={{ marginBottom: "8px" }}>
                <input
                  className="form-control"
                  name="content"
                  onKeyPress={this.handleKeyPress}
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
    allUserReducer: state.allUserReducer,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    fectchAllUsers: () => dispatch(fectchAllUsersRequest()),
    closeMessage: () => dispatch(closeMessage()),
    sendMessageToBot: (content) => dispatch(sendMessageToBot(content)),
    sendMessageToUser: (to, content) =>
      dispatch(sendMessageToUser(to, content, false)),
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(memo(CreateMessage));
