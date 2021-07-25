import React, { Component, memo } from "react";
import { connect } from "react-redux";
import { Alert as AntAlert } from "antd";
import { hideAlert } from "../../../actions/alertActions";
import "./Alert.css";

class Alert extends Component {
  render() {
    const { alerts } = this.props.alertReducer;
    const alertComponents = alerts.map((alert) => {
      return (
        <AntAlert
          key={alert.id}
          className={alert.hiding ? "hiding" : ""}
          message={alert.message}
          description={alert.description}
          type={alert.success ? "success" : "error"}
          showIcon
          closable
          onClose={(e) => {
            e.preventDefault();
            this.props.hideAlert(alert._id);
          }}
        />
      );
    });
    return <div className="alert-component">{alertComponents}</div>;
  }
}
const mapStateToProps = (state) => {
  return {
    alertReducer: state.alertReducer,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    hideAlert: () => dispatch(hideAlert()),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(memo(Alert));
