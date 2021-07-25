import React, { Component } from "react";
import { isValidLength } from "./../../../extentions/ArrayEx";

class BrandItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      _id: "",
      name: "",
      description: "",
      status: "",
      isEditing: false,
      errors: {
        name: "",
      },
    };
  }

  onChange = (e) => {
    var target = e.target;
    var { name, value } = target;
    let errors = this.state.errors;
    var checkLength;
    switch (name) {
      case "name":
        checkLength = isValidLength(value, 1, 20);
        errors.name = !checkLength.valid ? checkLength.error : "";
        break;
      case "status":
        value = e.target.checked;
        break;
      default:
        break;
    }
    this.setState({
      [name]: value,
    });
  };

  componentDidMount() {
    if (this.props.brand) {
      var { _id, name, description, status } = this.props.brand;
      this.setState({
        _id,
        name,
        description,
        status,
      });
    }
  }

  onSubmit = () => {
    var { _id, name, description, status, isEditing } = this.state;
    if (isEditing && this.validateForm(this.state.errors)) {
      var data = {
        _id,
        name,
        description,
        status,
      };
      this.props.onUpdateBrand(data);
      this.setState({
        isEditing: !isEditing,
      });
    }
  };

  onEdit = () => {
    var { name, description, status } = this.props.brand;
    this.setState({
      name,
      description,
      status,
      isEditing: !this.state.isEditing,
    });
  };

  onCancel = () => {
    this.setState({
      isEditing: !this.state.isEditing,
    });
  };

  validateForm = (errors) => {
    let valid = true;
    Object.values(errors).forEach((val) => val.length > 0 && (valid = false));
    return valid;
  };

  render() {
    const { errors, isEditing } = this.state;
    if (isEditing)
      return (
        <tr>
          <td>
            <input
              className="form-control"
              name="name"
              value={this.state.name}
              onChange={this.onChange}
            />
            {errors.name.length > 0 && (
              <span className="text-danger">{errors.name}</span>
            )}
          </td>
          <td>
            <input
              className="form-control"
              name="description"
              value={this.state.description}
              onChange={this.onChange}
            />
          </td>
          <td>
            <input
              name="status"
              type="checkbox"
              checked={this.state.status}
              onChange={this.onChange}
            />
          </td>
          <td>
            <button
              disabled={this.props.updateLoading ? true : false}
              type="button"
              className="btn-icon btn btn-primary btn-save mr-2"
              onClick={this.onSubmit}
            >
              <i className="fas fa-save"></i>
            </button>
            <button
              type="button"
              className="btn-icon btn btn-danger"
              onClick={this.onCancel}
            >
              <i className="fas fa-times"></i>
            </button>
          </td>
        </tr>
      );
    else
      return (
        <tr>
          <td>{this.props.brand.name}</td>
          <td>{this.props.brand.description}</td>
          <td>
            <input readOnly type="checkbox" checked={this.props.brand.status} />
          </td>
          <td>
            <button
              style={{ border: "none", background: "transparent" }}
              type="button"
              onClick={this.onEdit}
            >
              <i className="fa fa-edit"></i>
            </button>
          </td>
        </tr>
      );
  }
}
export default BrandItem;
