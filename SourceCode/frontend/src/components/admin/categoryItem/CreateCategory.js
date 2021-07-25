import React, { Component } from "react";
import { isValidLength } from "../../../extentions/ArrayEx";
class CreateCategory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      _id: "",
      categoryGroupId: "-1",
      name: "",
      errors: {
        name: "",
        categoryGroupId: "",
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
      case "categoryGroupId":
        errors.categoryGroupId = value === "-1" ? "Chọn nhóm loại" : "";
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
    if (this.state.isFirstSubmit && this.state.categoryGroupId === "-1") {
      let errors = this.state.errors;
      errors.categoryGroupId = "Chọn nhóm loại";
      this.setState({
        errors,
      });
    }
    if (this.validateForm(this.state.errors)) {
      var { name, categoryGroupId, status } = this.state;
      var data = {
        name,
        categoryGroupId,
        status,
      };
      this.props.onCreateCategory(data);
      this.props.onCloseAddForm();
    }
  };

  validateForm = (errors) => {
    let valid = true;
    Object.values(errors).forEach((val) => val.length > 0 && (valid = false));
    return valid;
  };

  render() {
    const categoryGroupsOption = this.props.categoryGroups
      ? this.props.categoryGroups.map((categoryGroup, index) => {
          return (
            <option
              key={categoryGroup._id}
              index={index}
              value={categoryGroup._id}
            >
              {categoryGroup.name}
            </option>
          );
        })
      : "";
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
          <select
            className="form-control"
            name="categoryGroupId"
            onChange={this.onChange}
            value={this.state.categoryGroupId}
          >
            <option value={-1}>Chọn nhóm loại sản phẩm</option>
            {categoryGroupsOption}
          </select>
          {this.state.errors.categoryGroupId.length > 0 && (
            <span className="text-danger">
              {this.state.errors.categoryGroupId}
            </span>
          )}
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

export default CreateCategory;
