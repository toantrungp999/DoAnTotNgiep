import React, { Component, memo } from "react";
import "./Select.css";
import "./Label.css";

class Label extends Component {
  render() {
    const { value, label, labelWidth } = this.props;
    return (
      <div className="form-field">
        <label style={{ width: labelWidth }}>{label}</label>
        <div>
          <label>{value}</label>
        </div>
      </div>
    );
  }
}

export default memo(Label);
