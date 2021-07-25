import React, { Component, memo } from "react";
import { validation } from "../../../extentions/validaton";
import { WarningOutlined } from "@ant-design/icons";
import "./Select.css";

class Select extends Component {
  state = { message: "", change: false };

  componentDidMount() {
    const { value, rules } = this.props;
    const validateResult = validation(value, rules);
    // this.props.setValidate(validateResult.valid, name);
    this.setState({ message: validateResult.message });
  }

  static getDerivedStateFromProps(nextProps) {
    const { value, rules, firstSubmit } = nextProps;
    const validateResult = validation(value, rules);

    return { message: validateResult.message, change: firstSubmit };
  }

  onChange = (e) => {
    // const { name, value } = e.target;
    // const { rules } = this.props;
    // const validateResult = validation(value, rules);
    // this.state.message = validateResult.message;
    this.setState({ change: true });
    //this.props.setValidate(validateResult.valid, name);
    this.props.onChange(e);
  };
  render() {
    const { message, change } = this.state;
    const {
      firstSubmit,
      name,
      value,
      label,
      placeHolder,
      options,
      labelWidth,
      vertical,
    } = this.props;
    const invalid =
      message.length > 0 && (firstSubmit === true || change === true)
        ? true
        : undefined;
    const selectOptions = options.map((option, index) => {
      return (
        <option key={index} value={option.value}>
          {option.label}
        </option>
      );
    });

    return (
      <div
        className={
          "form-field" +
          (invalid ? " invalid" : "") +
          (vertical ? " vertical" : "")
        }
      >
        <label style={{ width: labelWidth }}>{label}</label>
        <div className="select-wrapper value-wrapper">
          <select name={name} value={value} onChange={this.onChange}>
            {placeHolder ? (
              <option value="" data-default>
                {placeHolder}
              </option>
            ) : (
              ""
            )}
            {selectOptions}
          </select>
          {invalid ? (
            <div className="invalid-message">
              <WarningOutlined /> {message}
            </div>
          ) : (
            ""
          )}
        </div>
      </div>
    );
  }
}

export default memo(Select);
