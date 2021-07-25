import React from "react";
import "./App.css";
import Routes from "./routes/Routes";
import "antd/dist/antd.css";
import {
  initialization,
  login,
  fectchMessengersRequest,
} from "./actions/messengerActions";
import { Component } from "react";
import { connect } from "react-redux";

class App extends Component {
  componentDidMount() {
    this.props.initialization();
    if (this.props.userInfoReducer && this.props.userInfoReducer.userInfo) {
      this.props.fectchMessengers();
      login();
    }
  }

  render() {
    return (
      <div className="App">
        <Routes />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    userInfoReducer: state.userInfoReducer,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    initialization: () => dispatch(initialization()),
    fectchMessengers: () => dispatch(fectchMessengersRequest()),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(App);
