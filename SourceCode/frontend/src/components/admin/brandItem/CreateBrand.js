import React, { Component } from "react";
import { isValidLength } from "../../../extentions/ArrayEx";
class CreateBrand extends Component {
  constructor(props) {
    super(props);
    this.state = {
      _id: "",
      name: "",
      description: "",
      errors: {
        name: "",
      },
      isFirstSubmit: true,
    };
  }

  onChange = (e) => {
    const target = e.target;
    const { name, value } = target;
    let errors = this.state.errors;
    let checkLength;
    switch (name) {
      case "name":
        checkLength = isValidLength(value, 1, 20);
        errors.name = !checkLength.valid ? checkLength.error : "";
        break;
      default:
        break;
    }
    this.setState({
      [name]: value,
    });
  };

  onSubmit = () => {
    if (this.state.isFirstSubmit && this.state.name === "") {
      let errors = this.state.errors;
      errors.name = "Chưa nhập";
      this.setState({
        errors,
      });
    }
    if (this.validateForm(this.state.errors)) {
      var { name, description, status } = this.state;
      var data = {
        name,
        description,
        status,
      };
      this.props.onCreateBrand(data);
      this.props.onCloseAddForm();
    }
  };

  validateForm = (errors) => {
    let valid = true;
    Object.values(errors).forEach((val) => val.length > 0 && (valid = false));
    return valid;
  };

  render() {
    return (
      <tr>
        <td>
          <input
            name="name"
            value={this.state.name}
            onChange={this.onChange}
            className="form-control"
          />
          {this.state.errors.name.length > 0 && (
            <span className="text-danger">{this.state.errors.name}</span>
          )}
        </td>
        <td>
          <input
            name="description"
            value={this.state.description}
            onChange={this.onChange}
            className="form-control"
          />
        </td>
        <td>
          <input type="checkbox" readOnly checked />
        </td>
        <td>
          <button
            type="button"
            className="btn-icon btn btn-primary"
            onClick={this.onSubmit}
          >
            <i className="fa fa-plus mr-1 ml-1" aria-hidden="true"></i>
          </button>
        </td>
      </tr>
    );
  }
}

export default CreateBrand;
