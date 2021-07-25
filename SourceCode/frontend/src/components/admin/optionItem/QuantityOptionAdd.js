import React, { Component } from "react";
import { findIndexById, isNumber } from "../../../extentions/ArrayEx";

class QuantityOptionAdd extends Component {
  constructor(props) {
    super(props);
    this.state = {
      colorId: -1,
      sizeId: -1,
      max: 9999,
      quantity: "",
      errors: {
        size: "Chưa chọn",
        color: "Chưa chọn",
        quantity: "Chưa nhập",
      },
      firstSubmit: false,
    };
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps) {
      this.setState({
        colorId: -1,
      });
    }
  }

  onChange = (e) => {
    let target = e.target;
    let { name, value } = target;
    let errors = this.state.errors;
    let checkNumber;
    switch (name) {
      case "sizeId":
        errors.size = value === "-1" ? "Chọn kích cỡ" : "";
        break;
      case "colorId":
        errors.color = value === "-1" ? "Chọn màu" : "";
        break;
      case "quantity":
        checkNumber = isNumber(value);
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
    if (name === "colorId") {
      errors.size = "Chọn kích cỡ";
      this.setState({ sizeId: -1 });
    }
  };

  onSubmit = () => {
    let { colorId, sizeId, quantity, errors } = this.state;
    let _id = this.props._id;
    if (this.validateForm(errors)) {
      let data = {
        productId: _id,
        colorId,
        sizeId,
        quantity,
      };
      this.props.onCreateQuantityOption(data);
      this.setState({
        colorId: -1,
        sizeId: -1,
        quantity: "",
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
    const { colorOptions, sizeOptions, quantityOptions } = this.props;
    const { colorId } = this.state;
    const _sizeOptions = sizeOptions ? [...sizeOptions] : "";
    if (quantityOptions && _sizeOptions && colorId !== -1) {
      for (let i = quantityOptions.length - 1; i >= 0; i--) {
        if (quantityOptions[i].colorId === colorId) {
          let index = findIndexById(_sizeOptions, quantityOptions[i].sizeId);
          if (index !== -1) _sizeOptions.splice(index, 1);
        }
      }
    }

    const elementSizeOption = _sizeOptions
      ? _sizeOptions.map((sizeOption, index) => {
          return (
            <option key={sizeOption._id} index={index} value={sizeOption._id}>
              {sizeOption.size}
            </option>
          );
        })
      : null;
    const elementColorOption = colorOptions
      ? colorOptions.map((colorOption, index) => {
          return (
            <option key={colorOption._id} index={index} value={colorOption._id}>
              {colorOption.color}
            </option>
          );
        })
      : null;
    return (
      <>
        <tr className="first-row">
          <td>
            <select
              className={
                "form-control" +
                (firstSubmit && errors.color.length > 0 ? " invalid-input" : "")
              }
              name="colorId"
              value={this.state.colorId}
              onChange={this.onChange}
            >
              <option value={-1}>Chọn màu</option>
              {elementColorOption}
            </select>
            <div className="invalid-message text-center">
              {firstSubmit ? errors.color : ""}
            </div>
          </td>
          <td>
            <select
              className={
                "form-control" +
                (firstSubmit && errors.size.length > 0 ? " invalid-input" : "")
              }
              name="sizeId"
              value={this.state.sizeId}
              onChange={this.onChange}
            >
              <option value={-1}>Chọn kích cỡ</option>
              {elementSizeOption}
            </select>
            <div className="invalid-message text-center">
              {firstSubmit ? errors.size : ""}
            </div>
          </td>
          <td>
            <div className="row">
              {/* <div className="col-xs-6 col-sm-6 col-md-6 col-lg-6">
                                <input className={"form-control" + ((firstSubmit && errors.quantity.length > 0) ? ' invalid-input' : '')} name="quantity" value={this.state.quantity} onChange={this.onChange} type="range" min={0} max={this.state.max} />
                            </div> */}
              <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                <input
                  className={
                    "form-control" +
                    (firstSubmit && errors.quantity.length > 0
                      ? " invalid-input"
                      : "")
                  }
                  name="quantity"
                  value={this.state.quantity}
                  onChange={this.onChange}
                  type="number"
                />
              </div>
            </div>
            <div className="invalid-message text-center">
              {firstSubmit ? errors.quantity : ""}
            </div>
          </td>
          <td></td>
          <td>
            <button
              className="btn-icon btn btn-primary"
              type="button"
              style={{ border: "none" }}
              id="add-quantity"
              onClick={this.onSubmit}
            >
              <i className="fa fa-plus" aria-hidden="true"></i>
            </button>
          </td>
        </tr>
        <tr className="empty-row">
          <td colSpan="6"></td>
        </tr>
      </>
    );
  }
}
export default QuantityOptionAdd;
