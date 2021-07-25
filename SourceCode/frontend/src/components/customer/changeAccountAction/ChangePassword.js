import React, { Component, memo } from "react";
import Input from "../../common/formField/Input";
import "./ChangePassword.css";

class ChangePassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      password: "",
      newPassword: "",
      rePassword: "",
      firstSubmit: false,
      showAlert: false,
    };
  }

  onChange = (e) => {
    const { name, value } = e.target;
    this.setState({
      [name]: value.trim(),
    });
  };

  onHideAlert = () => {
    this.setState({ showAlert: false });
  };

  onSubmit = (event) => {
    event.preventDefault();
    var { password, newPassword, rePassword } = this.state;
    if (
      password.length >= 6 &&
      password.length <= 255 &&
      newPassword.length >= 6 &&
      newPassword.length <= 255 &&
      rePassword.length >= 6 &&
      rePassword.length <= 255 &&
      newPassword.trim() === rePassword.trim()
    ) {
      this.setState({ showAlert: true });
      this.props.onChangePassword({ password, newPassword });
    }
    this.setState({ firstSubmit: true });
  };

  render() {
    const { rePassword, newPassword, password, firstSubmit } = this.state;
    const { loading } = this.props.userActionReducer;
    return (
      <div className="change-password-page">
        <div className="header">
          <div className="title">Đổi mật khẩu</div>
          <div className="description">
            Không chia sẻ mật khẩu cho người khác
          </div>
        </div>
        <div className="body">
          <Input
            label="Mật khẩu"
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
            placeHolder="Nhập mật khẩu hiện tại"
            type="password"
          />
          <Input
            label="Mật khẩu mới"
            name="newPassword"
            value={newPassword}
            firstSubmit={firstSubmit}
            rules={[
              { require: true, message: "Chưa nhập mật khẩu mới" },
              { min: 6, message: "Nhập từ 6 ký tự" },
              { max: 255, message: "Nhập dưới 255 ký tự" },
            ]}
            labelWidth="200px"
            onChange={this.onChange}
            placeHolder="Nhập mật khẩu mới"
            type="password"
          />
          <Input
            label="Nhập lại mật khẩu"
            name="rePassword"
            value={rePassword}
            firstSubmit={firstSubmit}
            rules={[
              { require: true, message: "Vui lòng xác nhận lại mật khẩu" },
              { equal: newPassword, message: "Mật khẩu không khớp" },
              { min: 6, message: "Nhập từ 6 ký tự" },
              { max: 255, message: "Nhập dưới 255 ký tự" },
            ]}
            labelWidth="200px"
            onChange={this.onChange}
            placeHolder="Nhập lại mật khẩu"
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
                ĐỔI MẬT KHẨU
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default memo(ChangePassword);
