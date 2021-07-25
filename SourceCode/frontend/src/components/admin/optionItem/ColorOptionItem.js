import React, { Component } from "react";
import { isValidLength } from "./../../../extentions/ArrayEx";

class ColorOptionItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      _id: "",
      color: "",
      file: "",
      image: "",
      isEditing: false,
      errors: {
        color: "",
        file: "",
      },
    };
  }

  componentDidMount() {
    if (this.props.colorOption) {
      var { _id, color, image } = this.props.colorOption;
      this.setState({
        _id,
        color,
        image,
      });
    }
  }

  onChange = (e) => {
    var target = e.target;
    var { name, value } = target;
    let errors = this.state.errors;
    var checkLength;
    switch (name) {
      case "color":
        checkLength = isValidLength(value, 2, 255);
        errors.color = !checkLength.valid ? checkLength.error : "";
        break;
      default:
        break;
    }

    if (name === "file") {
      value = target.files[0];
      this.setState({
        image: URL.createObjectURL(value),
      });
    }
    this.setState({
      [name]: value,
    });
  };

  onSubmit = () => {
    const { _id, color, file, isEditing } = this.state;
    if (isEditing && this.validateForm(this.state.errors)) {
      const data = {
        _id,
        color,
        image: this.props.colorOption.image,
      };
      this.props.onUpdateColorOption(file, data);
      this.setState({
        isEditing: !isEditing,
      });
    }
  };

  onEdit = () => {
    const { _id, color, image } = this.props.colorOption;
    this.setState({
      _id,
      color,
      image,
      isEditing: !this.state.isEditing,
    });
  };

  onCancel = () => {
    this.setState({
      isEditing: !this.state.isEditing,
      errors: {
        color: "",
        file: "",
      },
    });
  };

  validateForm = (errors) => {
    let valid = true;
    Object.values(errors).forEach((val) => val.length > 0 && (valid = false));
    return valid;
  };

  render() {
    const { color, image } = this.props.colorOption;

    if (this.state.isEditing) {
      const { errors } = this.state;
      return (
        <tr>
          <td>
            <input
              className={
                "form-control" +
                (errors.color.length > 0 ? " invalid-input" : "")
              }
              name="color"
              value={this.state.color}
              onChange={this.onChange}
            />
            <div className="invalid-message">{errors.color}</div>
          </td>
          <td>
            <div className="form-group">
              <img
                className="image-option-product"
                alt="Hình sản phẩm"
                src={this.state.image}
              ></img>
            </div>
            <input
              type="file"
              className="color-option__uploadfile--none"
              name="file"
              id="optionEditImageColor"
              onChange={this.onChange}
            />
            <div className="form-group">
              <label
                className="color-option__uploadfile--btn"
                htmlFor="optionEditImageColor"
              >
                CHỌN ẢNH
              </label>
            </div>
          </td>
          <td>
            <div>
              <button
                type="submit"
                onClick={this.onSubmit}
                className="btn-icon btn btn-primary mb-1"
              >
                <i className="fa fa-save"></i>
              </button>
            </div>
            <div>
              <button
                type="button"
                className="btn-icon btn btn-danger"
                onClick={this.onCancel}
              >
                <i className="fa fa-times"></i>
              </button>
            </div>
          </td>
        </tr>
      );
    } else
      return (
        <tr>
          <td className="text-center align-middle">{color}</td>
          <td>
            <img
              className="image-option-product"
              alt="Hình sản phẩm"
              src={image}
            ></img>
          </td>
          <td>
            <button
              className="btn-icon-transparent"
              type="button"
              style={{ border: "none" }}
              onClick={this.onEdit}
            >
              <i className="fa fa-edit"></i>
            </button>
          </td>
        </tr>
      );
  }
}
export default ColorOptionItem;
