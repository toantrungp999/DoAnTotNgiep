import React, { Component, memo } from "react";
import DialogActionsAddress from "./ChangeAddress/DialogActionsAddress";
import AddressItem from "./AddressItem";
import { findIndexById } from "../../../extentions/ArrayEx";
import ConfirmDialog from "../../common/dialogs/ConfirmDialog";
import { PlusCircleOutlined } from "@ant-design/icons";
import Loading from "../../common/loading/Loading";
import "./ChangeAddress.css";

class ChangeAddress extends Component {
  constructor(props) {
    super(props);
    this.state = {
      address: "",
      idTrash: "",
      dialogAddressShow: false,
      dialogTrashShow: false,
      showAlert: false,
    };
  }

  addAddress = () => {
    this.setState({ address: "", dialogAddressShow: true });
    console.log(this.state);
  };

  updateAddress = (_id) => {
    var { addresses } = this.props.userAddressReducer;
    if (addresses) {
      var index = findIndexById(this.props.userAddressReducer.addresses, _id);
      if (index >= 0) {
        this.setState({ address: addresses[index], dialogAddressShow: true });
      }
    }
  };

  hideModal = () => {
    this.setState({ dialogAddressShow: false });
  };

  onShowDialogTrash = (idTrash) => {
    this.setState({ idTrash, dialogTrashShow: true });
  };

  onCloseDialogTrash = () => {
    this.setState({ idTrash: "", dialogTrashShow: false });
  };

  onConfirm = () => {
    this.props.onDeleteAddress(this.state.idTrash);
    this.setState({
      idTrash: "",
      dialogTrashShow: false,
      showAlert: true,
    });
  };

  onAddAddress = (data) => {
    this.props.onAddAddress(data);
    this.setState({
      showAlert: true,
      dialogAddressShow: false,
    });
  };

  onUpdateAddress = (data) => {
    this.props.onUpdateAddress(data);
    this.setState({
      showAlert: true,
      dialogAddressShow: false,
    });
  };

  onHideAlert = () => {
    this.setState({ showAlert: false });
  };

  render() {
    const { loading, addresses } = this.props.userAddressReducer;
    if (loading)
      return (
        <div>
          <Loading />
        </div>
      );
    else {
      const adressItems = addresses
        ? addresses.map((address, index) => {
            return (
              <AddressItem
                updateAddress={this.updateAddress}
                onShowDialogTrash={this.onShowDialogTrash}
                key={address._id}
                index={index}
                address={address}
              />
            );
          })
        : "";
      return (
        <div className="change-address-page">
          {this.state.dialogAddressShow ? (
            <DialogActionsAddress
              onClose={this.hideModal}
              onUpdateAddress={this.onUpdateAddress}
              onAddAddress={this.onAddAddress}
              updateAddress={this.updateAddress}
              userAddressReducer={this.props.userAddressReducer}
              address={this.state.address}
              citiesReducer={this.props.citiesReducer}
              districtsReducer={this.props.districtsReducer}
              fetchDistricts={this.props.fetchDistricts}
              mapClearState={this.props.mapClearState}
              getGeocodeRequest={this.props.getGeocodeRequest}
              getLocationRequest={this.props.getLocationRequest}
              mapReducer={this.props.mapReducer}
            />
          ) : (
            ""
          )}

          {this.state.dialogTrashShow ? (
            <ConfirmDialog
              message={"Bạn muốn xóa địa chỉ này?"}
              onClose={this.onCloseDialogTrash}
              onConfirm={this.onConfirm}
            />
          ) : null}
          <div className="header">
            <div className="title">Quản lý địa chỉ</div>
            <div className="description">
              Địa chỉ được sử dụng để đặt và giao hàng
            </div>
          </div>
          <div className="">
            <button className="btn-add" type="button" onClick={this.addAddress}>
              <PlusCircleOutlined /> Thêm địa chỉ
            </button>
          </div>
          <div className="body">{adressItems}</div>
        </div>
      );
    }
  }
}

export default memo(ChangeAddress);
