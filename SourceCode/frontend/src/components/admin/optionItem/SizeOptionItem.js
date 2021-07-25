import React, { Component } from "react";
import { isValidLength } from "../../../extentions/ArrayEx";
import ROLES from "../../../constants/Roles";

class SizeOptionItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      _id: "",
      size: "",
      isEditing: false,
      errors: {
        size: "",
      },
    };
  }

  componentDidMount() {
    if (this.props.sizeOption) {
      var { _id, size } = this.props.sizeOption;
      this.setState({
        _id,
        size,
      });
    }
  }

  onChange = (e) => {
    var target = e.target;
    var { name, value } = target;
    let errors = this.state.errors;
    let checkLength;
    switch (name) {
      case "size":
        checkLength = isValidLength(value, 1, 3);
        errors.size = !checkLength.valid ? checkLength.error : "";
        break;
      default:
    }
    this.setState({
      [name]: value,
    });
  };

  onSubmit = () => {
    var { _id, size, isEditing } = this.state;

    if (isEditing && this.validateForm(this.state.errors)) {
      var data = {
        _id,
        size,
      };
      this.props.onUpdateSizeOption(data);
      this.setState({
        isEditing: !isEditing,
      });
    }
  };

  onEdit = () => {
    var { _id, size } = this.props.sizeOption;
    this.setState({
      _id,
      size: size || "",
      isEditing: !this.state.isEditing,
    });
  };

  onCancel = () => {
    this.setState({
      isEditing: !this.state.isEditing,
      errors: {
        size: "",
      },
    });
  };

  validateForm = (errors) => {
    let valid = true;
    Object.values(errors).forEach((val) => val.length > 0 && (valid = false));
    return valid;
  };

  render() {
    const { size } = this.props.sizeOption;
    const role = this.props.role;
    if (role === ROLES.SUPER_ADMIN || role === ROLES.ADMIN) {
      if (this.state.isEditing) {
        const { errors } = this.state;
        return (
          <tr>
            <td>
              <input
                className={
                  "form-control" +
                  (errors.size.length > 0 ? " invalid-input" : "")
                }
                name="size"
                value={this.state.size}
                onChange={this.onChange}
              />
              <div className="invalid-message text-center">{errors.size}</div>
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
            <td>{size}</td>
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
    } else
      return (
        <tr>
          <td>{size}</td>
        </tr>
      );
  }
}
export default SizeOptionItem;
