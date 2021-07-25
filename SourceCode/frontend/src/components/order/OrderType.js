import React, { memo } from "react";
import { connect } from "react-redux";
import * as OrderTypes from "../../constants/OrderTypes";
import {
  createOrderRequest,
  ShippingFeeRequest,
} from "../../actions/orderActions";
import {
  fetchProfileRequest,
  updateProfileRequest,
  changePasswordRequest,
  changePhoneRequest,
  fetchAddressesRequest,
  updateAddressRequest,
  addAddressRequest,
  deleteAddressRequest,
  updateAvatarRequest,
  clearInform,
} from "../../actions/userActions";
import {
  fetchCitiesRequest,
  fetchDistrictsRequest,
  mapClearState,
  getGeocodeRequest,
  getLocationRequest,
} from "../../actions/locationActions";
import {
  convertNumberToVND,
  getStringDate,
  isPhoneNumber,
} from "../../extentions/ArrayEx";
import ChooseShip from "./ChooseShip";
import Select from "../common/formField/Select";
import Label from "../common/formField/Label";
import Input from "../common/formField/Input";
import { WarningOutlined } from "@ant-design/icons";
import DialogActionsAddress from "../customer/changeAccountAction/ChangeAddress/DialogActionsAddress";
import "./OrderType.css";

class OrderType extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      orderType: OrderTypes.ONLINE_ORDER.ORDER_TYPE,
      paymentType: "",
      receiveType: "",
      addressId: "", //'' require to choose user Address  , '-2' storeAddress, '-99' new address, '-100' chosing new address
      newAddress: "",
      name: "",
      phoneNumber: "",
      shipId: "-2", //-2 not Ship //-1 require Ship but not choose yet
      shipDialog: false,
      firstSubmit: false,
    };
  }

  componentDidMount() {
    this.props.fetchCities();
    this.props.fetchAddresses();
    this.setState({
      name: this.props.userInfoReducer.userInfo.name,
      phoneNumber: this.props.userInfoReducer.userInfo.phoneNumber
        ? this.props.userInfoReducer.userInfo.phoneNumber
        : "",
    });
  }

  onChange = (e) => {
    var { name, value } = e.target;
    switch (name) {
      case "orderType":
        if (value === OrderTypes.ONLINE_ORDER.ORDER_TYPE) {
          this.setState({
            name: this.props.userInfoReducer.userInfo.name,
            phoneNumber: this.props.userInfoReducer.userInfo.phoneNumber
              ? this.props.userInfoReducer.userInfo.phoneNumber
              : "",
          });
        } else {
          this.setState({ name: "", phoneNumber: "" });
        }
        this.setState({
          [name]: value,
          paymentType: "",
          receiveType: "",
          addressId: "",
          firstSubmit: false,
        });
        break;
      case "paymentType":
        this.setState({
          [name]: value,
        });
        break;
      case "receiveType":
        this.setState({
          [name]: value,
        });
        if (value === OrderTypes.ONLINE_ORDER.RECEIVE_TYPE.SHIP) {
          this.setState({ addressId: "" });
        } else if (value === OrderTypes.ONLINE_ORDER.RECEIVE_TYPE.IN_STORE) {
          this.setState({ addressId: "-2", shipId: "-2" });
        }
        break;

      case "address":
        this.setState({
          addressId: value,
        });
        this.setState({ shipId: "-1" });
        if (value !== "-100") {
          // '-100' is chosing new Address
          if (value === "-99") {
            this.props.ShippingFeeRequest(this.state.newAddress);
          } else {
            const userAddresses = this.props.userAddressReducer.addresses;
            this.props.ShippingFeeRequest(userAddresses[Number(value)]);
          }
        }

        break;
      default:
        this.setState({
          [name]: value,
        });
    }
    this.forceUpdate();
  };
  CreateOrder = () => {
    const userAddresses = this.props.userAddressReducer.addresses;
    const { shipInfos } = this.props.createOrderReducer;
    const { storeAddress } = this.props.createOrderReducer;
    const optionList = this.props.createOrderReducer.carts.map((cart) => {
      return {
        colorId: cart.colorId._id,
        sizeId: cart.sizeId._id,
        quantity: cart.quantity,
      };
    });
    const {
      orderType,
      paymentType,
      receiveType,
      addressId,
      name,
      phoneNumber,
      shipId,
    } = this.state;
    const userInfo = { name, phoneNumber };
    console.log(orderType);
    if (
      orderType !== "" &&
      paymentType !== "" &&
      receiveType !== "" &&
      isPhoneNumber(phoneNumber) &&
      name &&
      name.length <= 255
    ) {
      if (orderType === OrderTypes.IN_STORE_ORDER.ORDER_TYPE) {
        if (name !== "" && phoneNumber !== "" && addressId === "-2") {
          let data = {
            optionList,
            orderType,
            paymentType,
            receiveType,
            address: storeAddress,
            userInfo,
            shipInfo: null,
          };
          this.props.createOrderRequest(data, "instore");
        }
      } else if (orderType === OrderTypes.ONLINE_ORDER.ORDER_TYPE) {
        if (
          receiveType === OrderTypes.ONLINE_ORDER.RECEIVE_TYPE.SHIP &&
          addressId !== "" &&
          addressId !== "-100" &&
          shipId !== "-1"
        ) {
          const address =
            addressId === "-99"
              ? this.state.newAddress
              : userAddresses[Number(addressId)];
          let data = {
            optionList,
            orderType,
            paymentType,
            receiveType,
            address,
            userInfo,
            shipInfo: shipInfos[Number(shipId)],
          };
          this.props.createOrderRequest(data, "online");
        } else if (
          receiveType === OrderTypes.ONLINE_ORDER.RECEIVE_TYPE.IN_STORE
        ) {
          let data = {
            optionList,
            orderType,
            paymentType,
            receiveType,
            address: storeAddress,
            userInfo,
            shipInfo: null,
          };
          this.props.createOrderRequest(data, "online");
        }
      }
    }
    this.setState({ firstSubmit: true });
  };

  openChooseShip = () => {
    if (this.state.newAddress || this.state.addressId)
      this.setState({ shipDialog: true });
  };

  closeChooseShip = () => {
    this.setState({ shipDialog: false });
  };

  onChooseShip = (id) => {
    this.setState({
      shipId: id.toString(),
    });
  };

  onChoseNewAddress = (data) => {
    this.props.ShippingFeeRequest(data);
    this.setState({
      newAddress: data,
      addressId: "-99",
    });
  };

  onCloseAddessPicker = () => {
    this.setState({
      newAddress: "",
      addressId: "",
      shipId: "-2",
    });
  };

  render() {
    let userAddresses = this.props.userAddressReducer.addresses;
    let {
      addressId,
      newAddress,
      orderType,
      paymentType,
      receiveType,
      name,
      phoneNumber,
      shipId,
      shipDialog,
      firstSubmit,
    } = this.state;
    let role = this.props.userInfoReducer.userInfo.role;
    let total = this.props.total;
    let { shipInfos, storeAddress } = this.props.createOrderReducer;

    let OrderTypeOptions = [];
    for (const [index, value] of Object.entries(OrderTypes)) {
      console.log(index);
      if (value.ORDER_TYPE === OrderTypes.IN_STORE_ORDER.ORDER_TYPE) {
        if (role === "ADMIN" || role === "SUPER_ADMIN") {
          OrderTypeOptions.push({
            value: value.ORDER_TYPE,
            label: value.ORDER_TYPE,
          });
        }
      } else {
        OrderTypeOptions.push({
          value: value.ORDER_TYPE,
          label: value.ORDER_TYPE,
        });
      }
    }
    let paymentTypes;
    let receiveTypes;
    if (orderType === OrderTypes.IN_STORE_ORDER.ORDER_TYPE) {
      paymentTypes = OrderTypes.IN_STORE_ORDER.PAYMENT_TYPE;
      receiveTypes = OrderTypes.IN_STORE_ORDER.RECEIVE_TYPE;
    } else if (orderType === OrderTypes.ONLINE_ORDER.ORDER_TYPE) {
      paymentTypes = OrderTypes.ONLINE_ORDER.PAYMENT_TYPE;
      receiveTypes = OrderTypes.ONLINE_ORDER.RECEIVE_TYPE;
    }

    let PaymentTypeOptions = [];
    for (const [index, value] of Object.entries(paymentTypes)) {
      console.log(index);
      PaymentTypeOptions.push({ value: value, label: value });
    }

    let ReceiveTypeOptions = [];
    for (const [index, value] of Object.entries(receiveTypes)) {
      console.log(index);
      ReceiveTypeOptions.push({ value: value, label: value });
    }

    let addressOptions = [];
    if (receiveType === OrderTypes.ONLINE_ORDER.RECEIVE_TYPE.SHIP) {
      addressOptions = userAddresses
        ? userAddresses.map((address, index) => {
            return {
              value: index.toString(),
              label:
                address.streetOrBuilding +
                ", " +
                address.ward +
                ", " +
                address.district +
                ", " +
                address.city,
            };
          })
        : "";
      if (addressId === "-99")
        addressOptions.push({
          value: "-99",
          label:
            newAddress.streetOrBuilding +
            ", " +
            newAddress.ward +
            ", " +
            newAddress.district +
            ", " +
            newAddress.city,
        });
      addressOptions.push({ value: "-100", label: "Địa chỉ mới" });
    }
    // else if (receiveType === OrderTypes.ONLINE_ORDER.RECEIVE_TYPE.IN_STORE) {
    //     addressOptions = {
    //         value: 0, label: storeAddress.streetOrBuilding + ', ' + storeAddress.ward + ', '
    //             + storeAddress.district + ', ' + storeAddress.city
    //     }
    // }
    return (
      <div className="order-type-component">
        <div className="order-type-section">
          <Select
            name="orderType"
            value={orderType}
            firstSubmit={firstSubmit}
            label="Hình thức"
            labelWidth="200px"
            setValidate={this.setValidate}
            onChange={this.onChange}
            rules={[{ require: true, message: "Chưa nhập" }]}
            options={OrderTypeOptions}
          />
          {orderType === OrderTypes.IN_STORE_ORDER.ORDER_TYPE ? (
            <>
              <Label
                label="Nhân viên"
                labelWidth="200px"
                value={this.props.userInfoReducer.userInfo.name}
              />
            </>
          ) : (
            ""
          )}
          <Input
            name="name"
            value={name}
            firstSubmit={firstSubmit}
            label="Tên khách hàng"
            labelWidth="200px"
            setValidate={this.setValidate}
            onChange={this.onChange}
            rules={[
              { require: true, message: "Chưa nhập" },
              { max: 255, message: "Nhập dưới 255 ký tự" },
            ]}
          />
          <Input
            name="phoneNumber"
            value={phoneNumber}
            firstSubmit={firstSubmit}
            label="Số điện thoại"
            labelWidth="200px"
            setValidate={this.setValidate}
            onChange={this.onChange}
            rules={[
              { require: true, message: "Chưa nhập" },
              { phoneNumber: true, message: "Không phải số điện thoại" },
            ]}
          />

          <Select
            name="paymentType"
            value={paymentType}
            firstSubmit={firstSubmit}
            label="Thanh toán"
            placeHolder="Chọn hình thức thanh toán"
            labelWidth="200px"
            setValidate={this.setValidate}
            onChange={this.onChange}
            rules={[{ require: true, message: "Chưa nhập" }]}
            options={PaymentTypeOptions}
          />

          <Select
            name="receiveType"
            value={receiveType}
            firstSubmit={firstSubmit}
            label="Nhận hàng"
            placeHolder="Chọn hình thức nhận hàng"
            labelWidth="200px"
            setValidate={this.setValidate}
            onChange={this.onChange}
            rules={[{ require: true, message: "Chưa nhập" }]}
            options={ReceiveTypeOptions}
          />
          {receiveType === OrderTypes.ONLINE_ORDER.RECEIVE_TYPE.SHIP ? (
            <Select
              name="address"
              value={addressId}
              firstSubmit={firstSubmit}
              label="Địa chỉ"
              placeHolder="Chọn địa chỉ giao hàng"
              labelWidth="200px"
              setValidate={this.setValidate}
              onChange={this.onChange}
              rules={[{ require: true, message: "Chưa nhập" }]}
              options={addressOptions}
            />
          ) : receiveType === OrderTypes.ONLINE_ORDER.RECEIVE_TYPE.IN_STORE ? (
            <Label
              label="Cửa hàng"
              labelWidth="200px"
              value={
                storeAddress.streetOrBuilding +
                ", " +
                storeAddress.ward +
                ", " +
                storeAddress.district +
                ", " +
                storeAddress.city
              }
            />
          ) : (
            ""
          )}
          {addressId === "-100" ? (
            <DialogActionsAddress
              onClose={this.onCloseAddessPicker}
              // onUpdateAddress={this.onUpdateAddress}
              onAddAddress={this.onChoseNewAddress}
              updateAddress={this.updateAddress}
              userAddressReducer={this.props.userAddressReducer}
              // address={this.state.address}
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
          <div>
            <div>
              {shipId !== "-2" ? (
                <div className="form-field ship">
                  <label style={{ width: "200px" }}>Giao hàng</label>
                  <div>
                    <div
                      className="selected-ship-section"
                      onClick={this.openChooseShip}
                    >
                      <div className="ship-brand">
                        {shipId !== "-1"
                          ? shipInfos[shipId].name
                          : "Chọn phương thức"}
                      </div>
                      <div className="ship-info">
                        <div className="ship-fee">
                          {shipId !== "-1"
                            ? convertNumberToVND(
                                shipInfos[shipId].shippingFee
                              ) + "đ"
                            : ""}
                        </div>
                        <div className="receive-date">
                          {shipId !== "-1"
                            ? "Nhận " +
                              getStringDate(shipInfos[shipId].date * 1000)
                            : ""}
                        </div>
                      </div>
                    </div>
                    {firstSubmit && shipId === "-1" ? (
                      <div className="invalid-message">
                        <WarningOutlined /> Chưa chọn
                      </div>
                    ) : (
                      ""
                    )}
                  </div>
                </div>
              ) : (
                ""
              )}
              {shipDialog ? (
                <ChooseShip
                  shipInfos={shipInfos}
                  shipId={shipId}
                  closeChooseShip={this.closeChooseShip}
                  onChooseShip={this.onChooseShip}
                />
              ) : (
                ""
              )}
            </div>
          </div>
        </div>
        <div className="submit-section">
          <div className="shipping-fee-section">
            {shipId !== "-2" && shipId !== "-1" ? (
              <>
                <span className="label">Phí giao hàng: </span>
                <span className="shipping-fee">
                  {convertNumberToVND(shipInfos[shipId].shippingFee)}₫
                </span>
              </>
            ) : (
              ""
            )}
          </div>
          <div className="total-section">
            <span className="label">Tổng tiền: </span>
            <span className="price">
              {shipId !== "-2" && shipId !== "-1"
                ? convertNumberToVND(total + shipInfos[shipId].shippingFee) +
                  "₫"
                : convertNumberToVND(total) + "₫"}
            </span>
          </div>
          <div>
            {this.props.createSuccess === null ? (
              <button className="btn-order">ĐANG TẢI...</button>
            ) : (
              <button className="btn-order" onClick={this.CreateOrder}>
                ĐẶT HÀNG
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    createOrderReducer: state.createOrderReducer,
    userInfoReducer: state.userInfoReducer,
    userAddressReducer: state.userAddressReducer,

    districtsReducer: state.districtsReducer,
    citiesReducer: state.citiesReducer,
    mapReducer: state.mapReducer,
  };
};

const mapDispatchToProps = (dispatch) => ({
  createOrderRequest: (Order, path) => {
    dispatch(createOrderRequest(Order, path));
  },
  ShippingFeeRequest: (addressId) => {
    dispatch(ShippingFeeRequest(addressId));
  },
  fetchProfile: () => {
    dispatch(fetchProfileRequest());
  },
  fetchAddresses: () => {
    dispatch(fetchAddressesRequest());
  },
  updateProfile: (profile) => {
    dispatch(updateProfileRequest(profile));
  },
  changePassword: (data) => {
    dispatch(changePasswordRequest(data));
  },
  changePhone: (data) => {
    dispatch(changePhoneRequest(data));
  },
  fetchCities: () => {
    dispatch(fetchCitiesRequest());
  },
  fetchDistricts: (id) => {
    dispatch(fetchDistrictsRequest(id));
  },
  mapClearState: () => {
    dispatch(mapClearState());
  },
  getGeocodeRequest: (data) => {
    dispatch(getGeocodeRequest(data));
  },
  getLocationRequest: (data) => {
    dispatch(getLocationRequest(data));
  },
  addAddress: (data) => {
    dispatch(addAddressRequest(data));
  },
  updateAddress: (data) => {
    dispatch(updateAddressRequest(data));
  },
  deleteAddress: (addressId) => {
    dispatch(deleteAddressRequest(addressId));
  },
  updateAvatar: (file) => {
    dispatch(updateAvatarRequest(file));
  },
  clearInform: () => {
    dispatch(clearInform());
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(memo(OrderType));
