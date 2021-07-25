import React, { Component } from "react";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
//dùng file css ChangeAddress.css
class AddressItem extends Component {
  updateAddress = () => {
    this.props.updateAddress(this.props.address._id);
  };

  deleteAddress = () => {
    this.props.onShowDialogTrash(this.props.address._id);
  };

  render() {
    const { city, district, ward, streetOrBuilding } = this.props.address;
    return (
      <div className={"address-item " + (this.props.index === 0 && "first")}>
        <span
          className="address-string"
          onClick={this.updateAddress}
        >{`${streetOrBuilding}, ${ward}, ${district}, ${city}`}</span>
        <button className="btn-edit" onClick={this.updateAddress}>
          <EditOutlined />
        </button>
        <button className="btn-remove" onClick={this.deleteAddress}>
          <DeleteOutlined />
        </button>
      </div>
    );
  }
}
export default AddressItem;
