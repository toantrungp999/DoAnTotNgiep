import React, { Component, memo } from "react";
import { registerRequest } from "./../../../actions/userActions";
import {
  fetchCitiesRequest,
  fetchDistrictsRequest,
} from "../../../actions/locationActions";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import {
  isPhoneNumber,
  isEmail,
  isValidDate,
} from "../../../extentions/ArrayEx";
import Input from "../../../components/common/formField/Input";
import Select from "../../../components/common/formField/Select";
import "./Register.css";
class Register extends Component {
  constructor(props) {
    super(props);
    const { userInfo } = this.props.userInfoReducer;
    this.useEffect(userInfo);
    this.state = {
      username: "",
      password: "",
      re_password: "",
      name: "",
      phoneNumber: "",
      email: "",
      birthday: "",
      male: true,
      cityId: "1",
      districtId: "",
      wardId: "",
      streetOrBuilding: "",
      firstSubmit: false,
      submit: false,
    };
  }

  componentDidMount() {
    this.props.fetchCities();
    this.props.fetchDistricts(this.state.cityId);
  }

  onChange = (e) => {
    const target = e.target;
    const name = target.name;
    let value = target.value;
    if (name === "male") value = target.value === "true" ? true : false;
    else if (name === "cityId") {
      this.props.fetchDistricts(value);
      this.setState({
        districtId: "",
        wardId: "",
      });
    } else if (name === "districtId" && value === "-1") {
      this.setState({
        wardId: "",
      });
    }

    this.setState({
      [name]: value,
    });
  };

  useEffect = (userInfo) => {
    if (userInfo) this.props.history.push("/");
  };

  onSubmit = (event) => {
    event.preventDefault();
    let {
      email,
      password,
      re_password,
      username,
      phoneNumber,
      birthday,
      male,
      cityId,
      districtId,
      wardId,
      streetOrBuilding,
    } = this.state;
    password = password.trim();
    streetOrBuilding = streetOrBuilding.trim();
    if (
      email &&
      email.trim().length <= 255 &&
      isEmail(email.trim()) &&
      password &&
      password.trim().length <= 255 &&
      password.trim() === re_password.trim() &&
      username &&
      username.trim().length <= 255 &&
      isPhoneNumber(phoneNumber) &&
      birthday &&
      isValidDate(birthday)
    ) {
      var city, district, ward;
      var { cities } = this.props.citiesReducer;
      var index;
      if (cities) {
        index = this.findIndexById(cities, cityId);
        if (index >= 0) city = cities[index].name;
      }
      var { districts } = this.props.districtsReducer;
      if (districts) {
        index = this.findIndexById(districts, districtId);
        if (index >= 0) district = districts[index].name;
        var wards = districts
          .filter(
            (district) => Number(district.id) === Number(this.state.districtId)
          )
          .map((district) => district.wards);
        if (wards && wards.length > 0) {
          wards = wards[0];
          index = this.findIndexById(wards, wardId);
          if (index >= 0) ward = wards[index].name;
        }
      }
      if (city && district && ward && streetOrBuilding) {
        let name = username;
        email = email.trim();
        phoneNumber = phoneNumber.trim();
        name = name.trim();
        const data = {
          email,
          password,
          name,
          phoneNumber,
          birthday,
          male,
          address: {
            city,
            district,
            ward,
            streetOrBuilding,
          },
        };
        this.props.register(data);
        this.setState({ submit: true });
      }
    }
    this.setState({ firstSubmit: true });
  };

  findIndexById = (array, id) => {
    for (var i = array.length - 1; i >= 0; i--)
      if (Number(array[i].id) === Number(id)) return i;
    return -1;
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    if (
      nextProps.userRegisterReducer.loading === false &&
      nextProps.userRegisterReducer.message === undefined &&
      prevState.submit
    ) {
      return { submit: "success" };
    } else return null;
  }

  render() {
    var { firstSubmit, submit } = this.state;
    var { cities } = this.props.citiesReducer;
    var optionCity = cities
      ? cities.map((city, index) => {
          return { value: city.id, label: city.name };
        })
      : [];
    var { districts } = this.props.districtsReducer;
    var optionDistricts = [];
    var optionWards = [];
    if (districts) {
      optionDistricts = districts.map((district, index) => {
        return { value: district.id, label: district.name };
      });
      var wards = districts
        .filter(
          (district) => Number(district.id) === Number(this.state.districtId)
        )
        .map((district) => district.wards);
      if (wards.length > 0)
        optionWards = wards[0].map((ward, index) => {
          return { value: ward.id, label: ward.name };
        });
    }
    var { loading } = this.props.userRegisterReducer;
    var button_submit = loading ? (
      <input type="button" className="btn btn-submit" value="LOADING..." />
    ) : (
      <input type="submit" className="btn btn-submit" value="Đăng ký" />
    );
    if (submit === "success") this.props.history.push(`/login`);
    return (
      <div>
        <div className="register-page">
          <h3 className="title">Đăng ký tài khoản</h3>
          <form onSubmit={this.onSubmit}>
            <div className="info-section">
              <Input
                name="email"
                value={this.state.email}
                firstSubmit={firstSubmit}
                onChange={this.onChange}
                label="Email"
                placeHolder="Nhập địa chỉ email"
                labelWidth="150px"
                rules={[
                  { require: true, message: "Chưa nhập email" },
                  { email: true, message: "Email không hợp lệ" },
                  { min: 6, message: "Nhập từ 6 ký tự" },
                  { max: 255, message: "Không nhập quá 255 ký tự" },
                ]}
              />
              <Input
                name="password"
                value={this.state.password}
                firstSubmit={firstSubmit}
                onChange={this.onChange}
                type="password"
                label="Mật khẩu"
                placeHolder="Nhập mật khẩu"
                labelWidth="150px"
                rules={[
                  { require: true, message: "Chưa nhập mật khẩu" },
                  { min: 6, message: "Nhập từ 6 ký tự" },
                  { max: 255, message: "Không nhập quá 255 ký tự" },
                ]}
              />
              <Input
                name="re_password"
                value={this.state.re_password}
                firstSubmit={firstSubmit}
                onChange={this.onChange}
                type="password"
                label="Xác nhận"
                placeHolder="Nhập lại mật khẩu"
                labelWidth="150px"
                rules={[
                  { require: true, message: "Chưa nhập" },
                  { max: 255, message: "Không nhập quá 255 ký tự" },
                  {
                    equal: this.state.password,
                    message: "Mật khẩu không khớp",
                  },
                ]}
              />
              <Input
                name="username"
                value={this.state.username}
                firstSubmit={firstSubmit}
                onChange={this.onChange}
                label="Họ tên"
                placeHolder="Nhập họ và tên"
                labelWidth="150px"
                rules={[
                  { require: true, message: "Chưa nhập họ tên" },
                  { max: 255, message: "Không nhập quá 255 ký tự" },
                ]}
              />
              <Input
                name="phoneNumber"
                value={this.state.phoneNumber}
                firstSubmit={firstSubmit}
                onChange={this.onChange}
                label="Số điện thoại"
                placeHolder="Nhập số điện thoại"
                labelWidth="150px"
                rules={[
                  { require: true, message: "Chưa nhập số điện thoại" },
                  { phoneNumber: true, message: "Không phải số điện thoại" },
                ]}
              />
              <Input
                name="birthday"
                value={this.state.birthday}
                firstSubmit={firstSubmit}
                onChange={this.onChange}
                type="date"
                label="Ngày sinh"
                placeHolder="Nhập ngày sinh"
                labelWidth="150px"
                rules={[
                  { require: true, message: "Chưa nhập ngày sinh" },
                  { date: true, message: "Ngày sinh không hợp lệ" },
                ]}
              />
              <Select
                name="male"
                value={this.state.male.toString()}
                firstSubmit={firstSubmit}
                options={[
                  { value: "true", label: "Nam" },
                  { value: "false", label: "Nữ" },
                ]}
                onChange={this.onChange}
                label="Giới tính"
                placeHolder="Chọn giới tính"
                labelWidth="150px"
                rules={[{ require: true, message: "Chưa chọn giới tính" }]}
              />
            </div>
            <div className="address-section">
              <label>Địa chỉ</label>
              <Select
                name="cityId"
                value={this.state.cityId}
                firstSubmit={firstSubmit}
                options={optionCity}
                onChange={this.onChange}
                label=""
                placeHolder="Chọn tỉnh, thành phố"
                labelWidth="0px"
                rules={[{ require: true, message: "Chưa chọn tỉnh" }]}
              />
              <Select
                name="districtId"
                value={this.state.districtId}
                firstSubmit={firstSubmit}
                options={optionDistricts}
                onChange={this.onChange}
                label=""
                placeHolder="Chọn quận, huyện"
                labelWidth="0px"
                rules={[{ require: true, message: "Chưa chọn quận, huyện" }]}
              />
              <Select
                name="wardId"
                value={this.state.wardId}
                firstSubmit={firstSubmit}
                options={optionWards}
                onChange={this.onChange}
                label=""
                placeHolder="Chọn phường, xã"
                labelWidth="0px"
                rules={[{ require: true, message: "Chưa chọn phường, xã" }]}
              />
              <Input
                name="streetOrBuilding"
                value={this.state.streetOrBuilding}
                firstSubmit={firstSubmit}
                onChange={this.onChange}
                label=""
                placeHolder="Nhập địa chỉ của bạn"
                labelWidth="0px"
                rules={[
                  { require: true, message: "Chưa nhập địa chỉ" },
                  { max: 255, message: "Không nhập quá 255 ký tự" },
                ]}
              />

              <div className="form-group btn-container">{button_submit}</div>
              <div className="form-group text-center mrb-100">
                <span>
                  Bạn đã có tài khoản? <Link to="/Login">Đăng nhập ngay</Link>
                </span>
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    districtsReducer: state.districtsReducer,
    citiesReducer: state.citiesReducer,
    userRegisterReducer: state.userRegisterReducer,
    userInfoReducer: state.userInfoReducer,
  };
};

const mapDispatchToProps = (dispatch, props) => {
  return {
    register: (register) => {
      dispatch(registerRequest(register));
    },
    fetchCities: () => {
      dispatch(fetchCitiesRequest());
    },
    fetchDistricts: (id) => {
      dispatch(fetchDistrictsRequest(id));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(memo(Register));
