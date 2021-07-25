import React, { Component } from "react";
import { isValidLength, findIndexById } from "../../../extentions/ArrayEx";

class CategoryItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      _id: "",
      name: "",
      categoryGroupId: -1,
      status: "",
      isEditing: false,
      errors: {
        name: "",
      },
    };
  }

  onChange = (e) => {
    let target = e.target;
    let { name, value } = target;
    let errors = this.state.errors;
    let checkLength;
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
    if (this.props.category) {
      let { _id, name, categoryGroupId, status } = this.props.category;
      this.setState({
        _id,
        name,
        categoryGroupId,
        status,
      });
    }
  }

  onSubmit = () => {
    let { _id, name, categoryGroupId, status, isEditing } = this.state;
    if (isEditing && this.validateForm(this.state.errors)) {
      let data = {
        _id,
        name,
        categoryGroupId,
        status,
      };
      this.props.onUpdateCategory(data);
      this.setState({
        isEditing: !isEditing,
      });
    }
  };

  onEdit = () => {
    let { name, categoryGroupId, status } = this.props.category;
    this.setState({
      name,
      categoryGroupId,
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
    if (isEditing) {
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
            <select
              className="form-control"
              name="categoryGroupId"
              value={this.state.categoryGroupId}
              onChange={this.onChange}
            >
              {categoryGroupsOption}
            </select>
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
    } else {
      const categoryGroupIndex = this.props.categoryGroups
        ? findIndexById(this.props.categoryGroups, this.state.categoryGroupId)
        : -1;
      let categoryGroupName = "";
      if (categoryGroupIndex !== -1)
        categoryGroupName = this.props.categoryGroups
          ? this.props.categoryGroups[categoryGroupIndex].name
          : "";
      return (
        <tr>
          <td>{this.props.category.name}</td>
          <td>{categoryGroupName}</td>
          <td>
            <input
              readOnly
              type="checkbox"
              checked={this.props.category.status}
            />
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
}
export default CategoryItem;
