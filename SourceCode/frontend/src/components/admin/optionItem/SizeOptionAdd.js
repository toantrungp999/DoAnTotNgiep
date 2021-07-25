import React, { Component } from "react";
import { isValidLength } from "../../../extentions/ArrayEx";

class SizeOptionAdd extends Component {
  constructor(props) {
    super(props);
    this.state = {
      size: "",
      errors: {
        size: "Chưa nhập",
      },
      firstSubmit: false,
    };
  }

  onChange = (e) => {
    var target = e.target;
    var { name, value } = target;
    var { errors } = this.state;
    let checkLength;
    switch (name) {
      case "size":
        checkLength = isValidLength(value, 1, 3);
        errors.size = !checkLength.valid ? checkLength.error : "";
        break;
      default:
        break;
    }

    this.setState({
      [name]: value,
    });
  };

  onSubmit = () => {
    const { size, errors } = this.state;
    const _id = this.props._id;
    if (this.validateForm(errors)) {
      const data = { productId: _id, size };
      this.props.onCreateSizeOption(data);
      this.setState({ size: "" });
    }
    this.setState({
      firstSubmit: true,
    });
  };

  validateForm = (errors) => {
    let valid = true;
    Object.values(errors).forEach((val) => val.length > 0 && (valid = false));
    return valid;
  };

  render() {
    const { errors, firstSubmit } = this.state;
    return (
      <tr className="first-row">
        <td>
          <input
            className={
              "form-control" +
              (firstSubmit && errors.size.length > 0 ? " invalid-input" : "")
            }
            name="size"
            value={this.state.size}
            onChange={this.onChange}
          />
          <div className="invalid-message text-center">
            {firstSubmit ? errors.size : ""}
          </div>
        </td>
        <td>
          <button
            className="btn-icon btn btn-primary"
            type="button"
            style={{ border: "none" }}
            id="add-config"
            onClick={this.onSubmit}
          >
            <i className="fa fa-plus" aria-hidden="true"></i>
          </button>
        </td>
      </tr>
    );
  }
}
export default SizeOptionAdd;
