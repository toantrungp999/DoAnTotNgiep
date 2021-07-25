import React, { Component, memo } from "react";
import { isPhoneNumber } from "./../../../extentions/ArrayEx";
import Input from "../../common/formField/Input";
import "./ChangePhoneNumber.css"; // file này trống
/* dùng chung file css ChangePassword.css với ChangePassword.js */

class ChangePhoneNumber extends Component {
  constructor(props) {
    super(props);
    this.state = {
      password: "",
      phoneNumber: this.props.phoneNumber ? this.props.phoneNumber : "",
      showAlert: false,
      firstSubmit: false,
    };
  }

  onChange = (e) => {
    const { name, value } = e.target;
    this.setState({
      [name]: value.trim(),
    });
  };

  onSubmit = (e) => {
    e.preventDefault();
    const { password, phoneNumber } = this.state;
    if (
      password &&
      password.length <= 255 &&
      phoneNumber &&
      isPhoneNumber(phoneNumber)
    ) {
      this.setState({ showAlert: true });
      this.props.onChangePhone({ password, phoneNumber });
    }
    this.setState({ firstSubmit: true });
  };

  onHideAlert = () => {
    this.setState({ showAlert: false });
  };

  render() {
    const { loading } = this.props.userActionReducer;
    const { password, phoneNumber, firstSubmit } = this.state;
    return (
      <div className="change-phone-number-page change-password-page">
        <div className="header">
          <div className="title">Đổi mật khẩu</div>
          <div className="description">
            Không chia sẻ mật khẩu cho người khác
          </div>
        </div>
        <div className="body">
          <Input
            label="Số điện thoại"
            name="phoneNumber"
            value={phoneNumber}
            firstSubmit={firstSubmit}
            rules={[
              { require: true, message: "Chưa nhập số điện thoại" },
              { phoneNumber: true, message: "Không phải số điện thoại" },
            ]}
            labelWidth="200px"
            onChange={this.onChange}
            placeHolder="Nhập số điện thoại"
          />
          <Input
            label="Mật khẩu xác nhận"
            name="password"
            value={password}
            firstSubmit={firstSubmit}
            rules={[
              { require: true, message: "Chưa nhập mật khẩu" },
              { min: 6, message: "Nhập từ 6 ký tự" },
              { max: 255, message: "Nhập dưới 255 ký tự" },
            ]}
            labelWidth="200px"
            onChange={this.onChange}
            placeHolder="Nhập mật khẩu để xác nhận"
            type="password"
          />
          <div>
            {loading ? (
              <button type="button" className="btn-submit">
                ĐANG TẢI...
              </button>
            ) : (
              <button
                type="submit"
                className="btn-submit"
                onClick={this.onSubmit}
              >
                LƯU THAY ĐỔI
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }
}
export default memo(ChangePhoneNumber);
