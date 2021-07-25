import React, { Component } from "react";
import { findIndexById, isNumber } from "../../../extentions/ArrayEx";

class SizeOptionItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isEditting: false,
      quantity: "",
      max: 9999,
      errors: {
        quantity: "",
      },
    };
  }

  validateForm = (errors) => {
    let valid = true;
    Object.values(errors).forEach((val) => val.length > 0 && (valid = false));
    return valid;
  };

  onChange = (e) => {
    let target = e.target;
    let { name, value } = target;
    let errors = this.state.errors;
    let checkNumber = isNumber(value);
    switch (name) {
      case "quantity":
        errors.quantity = !checkNumber.valid ? checkNumber.error : "";
        if (errors.quantity.length === 0) {
          if (Number(value) < 0 || Number(value) > 999) {
            errors.quantity = "Nhập từ 0 đến 999";
          }
        }
        break;
      default:
        break;
    }
    if (name === "quantity" && this.state.max < Number(value)) return;
    this.setState({
      [name]: value,
    });
  };

  onSubmit = () => {
    const { _id } = this.props.quantityOption;
    const { quantity, isEditting } = this.state;
    if (isEditting && quantity && this.validateForm(this.state.errors)) {
      const data = {
        _id,
        quantity,
      };
      this.props.onUpdateQuantityOption(data);
      this.setState({
        isEditting: !isEditting,
      });
    }
  };

  onEdit = () => {
    const { quantityOption } = this.props;
    this.setState({
      isEditting: !this.state.isEditting,
      quantity: quantityOption.quantity,
    });
  };

  onCancel = () => {
    this.setState({
      isEditting: !this.state.isEditting,
      errors: { quantity: "" },
    });
  };

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps) {
      this.setState({
        sizeId: this.state.oldsizeId,
      });
    }
  }

  componentDidMount() {}

  render() {
    const { errors } = this.state;
    var { sizeOptions, quantityOption } = this.props;

    let size = "";
    let index = sizeOptions
      ? findIndexById(sizeOptions, this.props.quantityOption.sizeId)
      : -1;
    if (index > -1) size = sizeOptions[index].size;

    if (this.state.isEditting) {
      return (
        <tr>
          <td>{size}</td>
          <td>
            <div className="row">
              <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                <input
                  className={
                    "form-control" +
                    (errors.quantity.length > 0 ? " invalid-input" : "")
                  }
                  name="quantity"
                  value={this.state.quantity}
                  onChange={this.onChange}
                  type="number"
                />
              </div>
            </div>
            <div className="invalid-message text-center">{errors.quantity}</div>
          </td>
          <td>{quantityOption.orderQuantity}</td>
          <td>
            <div>
              <button
                type="button"
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
    } else {
      return (
        <tr>
          <td>{size}</td>
          <td>{quantityOption.quantity}</td>
          <td>{quantityOption.orderQuantity}</td>
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
}
export default SizeOptionItem;
