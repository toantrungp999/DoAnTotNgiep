import React, { Component } from "react";
import { isValidLength } from "./../../../extentions/ArrayEx";

class ColorOptionAdd extends Component {
  constructor(props) {
    super(props);
    this.state = {
      color: "",
      file: "",
      optionImage: "",
      errors: {
        color: "Chưa nhập",
        file: "Chưa chọn",
      },
      firstSubmit: false,
    };
  }

  onChange = (e) => {
    var target = e.target;
    var { name, value } = target;
    var { errors } = this.state;
    var checkLength;
    switch (name) {
      case "color":
        checkLength = isValidLength(value, 2, 255);
        errors.color = !checkLength.valid ? checkLength.error : "";
        break;
      case "file":
        errors.file = value.length > 0 ? "" : "Chưa chọn";
        break;
      default:
        break;
    }

    if (name === "file") {
      value = target.files[0];
      this.setState({
        optionImage: URL.createObjectURL(value),
      });
    }
    this.setState({
      [name]: value,
    });
  };

  onSubmit = () => {
    var { color, file, errors } = this.state;
    var _id = this.props._id;
    if (this.validateForm(errors)) {
      var data = {
        productId: _id,
        color,
        image: "",
      };
      console.log("data", data);
      this.props.onCreateColorOption(file, data);
      this.setState({
        color: "",
        file: "",
        optionImage: "",
      });
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
        <td className="align-middle">
          <input
            className={
              "form-control" +
              (firstSubmit && errors.color.length > 0 ? " invalid-input" : "")
            }
            name="color"
            value={this.state.color}
            onChange={this.onChange}
          />
          <div className="invalid-message text-center">
            {firstSubmit ? errors.color : ""}
          </div>
        </td>
        <td>
          <div className="form-group">
            {this.state.optionImage ? (
              <img
                className="image-option-product"
                alt="Hình sản phẩm"
                src={this.state.optionImage}
              ></img>
            ) : (
              ""
            )}
          </div>
          <input
            type="file"
            className="color-option__uploadfile--none"
            name="file"
            id="optionAddImageColor"
            onChange={this.onChange}
          />
          <div className="form-group">
            <label
              className="color-option__uploadfile--btn"
              htmlFor="optionAddImageColor"
            >
              CHỌN ẢNH
            </label>
          </div>
          <div className="invalid-message text-center">
            {firstSubmit ? errors.file : ""}
          </div>
        </td>
        <td>
          <button
            className="btn-icon btn btn-primary"
            type="button"
            style={{ border: "none" }}
            id="add-color"
            onClick={this.onSubmit}
          >
            <i className="fa fa-plus" aria-hidden="true"></i>
          </button>
        </td>
      </tr>
    );
  }
}
export default ColorOptionAdd;
