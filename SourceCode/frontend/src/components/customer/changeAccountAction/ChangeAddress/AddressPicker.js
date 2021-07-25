import React, { Component, memo } from "react";
import { findIndexById, findIndexByName } from "../../../../extentions/ArrayEx";
import "./DialogActionsAddress.css";
import stringSimilarity from "string-similarity";
import Input from "../../../common/formField/Input";
import Select from "../../../common/formField/Select";
import { EnvironmentFilled, AimOutlined } from "@ant-design/icons";
//dùng file css DialogActionsAddress.css

class ChangeAddressComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: "",
      addressId: "",
      cityId: 1,
      districtId: "",
      wardId: "",
      streetOrBuilding: "",
      isDefault: true,
      isSubmit: false,
      firstSubmit: false,
      address: "",
      useGPS: false,
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const { cities } = nextProps.citiesReducer;
    const { districts } = nextProps.districtsReducer;
    const { address } = nextProps.mapReducer;
    if (prevState.useGPS === true && cities && address) {
      const citisString = cities.map((citi) => {
        return citi.name;
      });
      const addressComponent = address.split(", ");
      const componentCount = addressComponent.length;
      const cityResult = stringSimilarity.findBestMatch(
        addressComponent[componentCount - 2],
        citisString
      ); //this is city
      const cityIndex = findIndexByName(cities, cityResult.bestMatch.target);
      if (cities[cityIndex].id !== prevState.cityId) {
        nextProps.fetchDistricts(cities[cityIndex].id);
        return { cityId: cities[cityIndex].id };
      } else if (districts) {
        const districtString = districts.map((district) => {
          return district.name;
        });
        const districtResult = stringSimilarity.findBestMatch(
          addressComponent[componentCount - 3],
          districtString
        );
        const districtIndex = findIndexByName(
          districts,
          districtResult.bestMatch.target
        );
        const wards = districts[districtIndex].wards;
        const wardsString = wards.map((ward) => {
          return ward.name;
        });
        const wardResult = stringSimilarity.findBestMatch(
          addressComponent[componentCount - 4],
          wardsString
        );
        const wardIndex = findIndexByName(wards, wardResult.bestMatch.target);
        return {
          districtId: districts[districtIndex].id,
          wardId: wards[wardIndex].id,
          streetOrBuilding: addressComponent[0],
        };
      }
    }

    if (
      prevState.address &&
      prevState.districtId === "" &&
      prevState.wardId === ""
    ) {
      var { district, ward, streetOrBuilding } = prevState.address;
      if (district && districts) {
        var index = findIndexByName(districts, district);
        if (index >= 0) {
          var districtId = districts[index].id;
          var wards = districts[index].wards;
          if (ward && wards.length > 0) {
            index = findIndexByName(wards, ward);
            if (index >= 0) {
              return {
                districtId,
                wardId: wards[index].id,
                streetOrBuilding,
              };
            }
          }
        }
      }
    }

    // var { loadingAddAddress, statusAddAddress } = nextProps.userAddressReducer;
    // if (!loadingAddAddress && statusAddAddress && this.state.isSubmit) {
    //     this.props.onClose();
    //     return { isSubmit: false };
    // }
    return null;
  }

  componentDidMount() {
    var id = this.state.cityId;
    if (this.props.address) {
      this.setState({ address: this.props.address });
      var { city } = this.props.address;
      var { cities } = this.props.citiesReducer;
      if (this.props.address && city) {
        var index = findIndexByName(cities, city);
        if (index >= 0) {
          id = cities[index].id;
          this.setState({
            addressId: this.props.address._id,
            isDefault: this.props.address.isDefault,
            address: this.props.address,
            cityId: id,
          });
        }
      }
    }
    this.props.fetchDistricts(id);
  }

  onUpdateMap = (e) => {
    e.preventDefault();
    // if (this.state.firstSubmit)
    //     this.checkFirstSubmit();
    // if (!this.validateForm(this.state.errors))
    //     return;
    var { cityId, districtId, wardId, streetOrBuilding } = this.state;
    if (
      cityId !== "" &&
      districtId !== "" &&
      wardId !== "" &&
      streetOrBuilding.trim().length > 0 &&
      streetOrBuilding.trim().length <= 255
    ) {
      var city, district, ward;
      var { cities } = this.props.citiesReducer;
      var { districts } = this.props.districtsReducer;
      if (cities && districts) {
        var index = findIndexById(cities, cityId);
        if (index >= 0) city = cities[index].name;
        index = findIndexById(districts, districtId);
        if (index >= 0) district = districts[index].name;
        var wards = districts
          .filter((district) => Number(district.id) === Number(districtId))
          .map((district) => district.wards);
        if (wards && wards.length > 0) {
          wards = wards[0];
          index = findIndexById(wards, wardId);
          if (index >= 0) ward = wards[index].name;
        }
      }
      if (city && district && ward && streetOrBuilding) {
        var data = { city, district, ward, streetOrBuilding, isDefault: false };
        this.props.getGeocodeRequest(data);
      }
    }
    this.setState({ firstSubmit: true });
  };

  onGetLocation = (e) => {
    e.preventDefault();
    navigator.geolocation.getCurrentPosition((position) => {
      console.log("Latitude is :", position.coords.latitude);
      console.log("Longitude is :", position.coords.longitude);
      this.props.getLocationRequest({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      });
    });
    this.setState({ useGPS: true });
  };

  onSubmit = (e) => {
    e.preventDefault();
    // if (this.state.firstSubmit)
    //     this.checkFirstSubmit();
    // if (!this.validateForm(this.state.errors))
    //     return;
    var { cityId, districtId, wardId, streetOrBuilding, addressId, isDefault } =
      this.state;
    if (
      cityId !== "" &&
      districtId !== "" &&
      wardId !== "" &&
      streetOrBuilding.trim().length > 0 &&
      streetOrBuilding.trim().length <= 255
    ) {
      var city, district, ward;
      var { cities } = this.props.citiesReducer;
      var { districts } = this.props.districtsReducer;
      if (cities && districts) {
        var index = findIndexById(cities, cityId);
        if (index >= 0) city = cities[index].name;
        index = findIndexById(districts, districtId);
        if (index >= 0) district = districts[index].name;
        var wards = districts
          .filter((district) => Number(district.id) === Number(districtId))
          .map((district) => district.wards);
        if (wards && wards.length > 0) {
          wards = wards[0];
          index = findIndexById(wards, wardId);
          if (index >= 0) ward = wards[index].name;
        }
      }
      if (city && district && ward && streetOrBuilding) {
        if (!addressId) {
          let data = {
            city,
            district,
            ward,
            streetOrBuilding,
            isDefault,
          };
          this.props.onAddAddress(data);
        } else {
          let data = {
            _id: addressId,
            city,
            district,
            ward,
            streetOrBuilding,
            isDefault,
          };
          this.props.onUpdateAddress(data);
          this.setState({ address: data });
        }
        this.setState({ isSubmit: true });
      }
    }
    this.setState({ firstSubmit: true });
  };

  onChange = (e) => {
    var target = e.target;
    var name = target.name;
    var value = target.value;
    if (name === "cityId") {
      this.props.fetchDistricts(value);
      this.setState({
        districtId: "",
        wardId: "",
        firstSubmit: false,
      });
    }

    if (name === "districtId") {
      this.setState({
        wardId: "",
        firstSubmit: false,
      });
    }
    if (target.type === "checkbox") value = target.checked;
    this.setState({
      [name]: value,
      useGPS: false,
    });
  };

  render() {
    console.log("renderState", this.state);
    var {
      messageAction,
      loadingAddAddress,
      loadingUpdateAddress,
      statusUpdateAddress,
    } = this.props.userAddressReducer;
    var { cityId, districtId, wardId, streetOrBuilding, firstSubmit } =
      this.state;
    var textSuccsess = "";
    if (this.state.addressId)
      textSuccsess = statusUpdateAddress ? (
        <span className="text-success mt-10">Cập nhật địa chỉ thành công</span>
      ) : (
        ""
      );
    var button_submit =
      loadingUpdateAddress || loadingAddAddress ? (
        <button type="button" className="btn btn-submit">
          LOADING...
        </button>
      ) : (
        <button
          type="submit"
          className="btn btn-submit"
          onClick={this.onSubmit}
        >
          XÁC NHẬN
        </button>
      );
    var messageErro = messageAction ? (
      <span className="text-danger">{messageAction}</span>
    ) : (
      ""
    );
    var { cities } = this.props.citiesReducer;
    var cityOptions = cities
      ? cities.map((city, index) => {
          return { value: city.id, label: city.name };
        })
      : "";
    var { districts } = this.props.districtsReducer;
    var districtOptions = [];
    var wardOptions = [];
    if (districts) {
      districtOptions = districts.map((district, index) => {
        return { value: district.id, label: district.name };
      });
      var wards = districts
        .filter(
          (district) => Number(district.id) === Number(this.state.districtId)
        )
        .map((district) => district.wards);
      if (wards.length > 0)
        wardOptions = wards[0].map((ward, index) => {
          return { value: ward.id, label: ward.name };
        });
    }
    return (
      <div className="address-form">
        <div className="header-title">
          {this.state.addressId ? "Cập nhật địa chỉ" : "Thêm địa chỉ"}
        </div>
        <div className="form-body">
          <Select
            name="cityId"
            value={cityId}
            firstSubmit={firstSubmit}
            options={cityOptions}
            onChange={this.onChange}
            label="Chọn tỉnh, thành phố"
            placeHolder="Chọn tỉnh, thành phố"
            vertical={true}
            rules={[{ require: true, message: "Chưa chọn tỉnh" }]}
          />

          <Select
            name="districtId"
            value={districtId}
            firstSubmit={firstSubmit}
            options={districtOptions}
            onChange={this.onChange}
            label="Chọn quận, huyện"
            placeHolder="Chọn quận, huyện"
            vertical={true}
            rules={[{ require: true, message: "Chưa chọn quận, huyện" }]}
          />
          <Select
            name="wardId"
            value={wardId}
            firstSubmit={firstSubmit}
            options={wardOptions}
            onChange={this.onChange}
            label="Chọn phường, xã"
            placeHolder="Chọn phường, xã"
            vertical={true}
            rules={[{ require: true, message: "Chưa chọn phường, xã" }]}
          />
          <Input
            name="streetOrBuilding"
            value={streetOrBuilding}
            firstSubmit={firstSubmit}
            onChange={this.onChange}
            label="Nhập địa chỉ"
            placeHolder="Nhập địa chỉ của bạn"
            vertical={true}
            rules={[
              { require: true, message: "Chưa nhập địa chỉ" },
              { max: 255, message: "Không nhập quá 255 ký tự" },
            ]}
          />
          <button className="btn-gps-mobile" onClick={this.onGetLocation}>
            <AimOutlined className="btn-gps-icon" /> Lấy vị trí của bạn
          </button>

          <div className="form-group">
            {textSuccsess}
            {messageErro}
          </div>
          <div className="form-group">
            {button_submit}
            <button
              type="button"
              className="btn btn-close"
              onClick={this.props.onClose}
            >
              THOÁT
            </button>
          </div>
        </div>
        <button className="btn-update" onClick={this.onUpdateMap}>
          <EnvironmentFilled className="btn-update-icon" />
        </button>
        <button className="btn-gps" onClick={this.onGetLocation}>
          <AimOutlined className="btn-gps-icon" />{" "}
        </button>
      </div>
    );
  }
}
export default memo(ChangeAddressComponent);
