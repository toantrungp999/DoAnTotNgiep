import React, { Component, memo } from "react";
import { resetPasswordRequest } from "./../../../actions/userActions";
import { connect } from "react-redux";
class ResetPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      code: "",
      password: "",
      recheckPassword: "",
    };
  }

  useEffect = (userInfo, status) => {
    const redirect = this.props.location.search
      ? this.props.location.search.split("=")[1]
      : "/";
    if (userInfo) this.props.history.push(redirect);
    else if (status) {
      setTimeout(
        function () {
          //Start the timer
          this.setState({ render: true }); //After 1 second, set render to true
        }.bind(this),
        5000
      );
      this.props.history.push("/login");
    }
  };

  onChange = (e) => {
    var target = e.target;
    var name = target.name;
    var value = target.value;
    this.setState({
      [name]: value,
    });
  };

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps) {
      var { statusReset } = nextProps.userForgotPasswordReducer;
      var { userInfo } = nextProps.userInfoReducer;
      this.useEffect(userInfo, statusReset);
    }
  }

  componentDidMount() {
    const { statusReset } = this.props.userForgotPasswordReducer;
    const { userInfo } = this.props.userInfoReducer;
    this.useEffect(userInfo, statusReset);
    const code = this.props.match.params.code;
    if (code) this.setState({ code });
  }

  onSubmit = (e) => {
    e.preventDefault();
    let { code, password, recheckPassword } = this.state;
    code = code.trim();
    password = password.trim();
    recheckPassword = recheckPassword.trim();
    if (code && password && password === recheckPassword)
      this.props.resetPassword(code, password);
  };

  render() {
    var { message, loadingReset, statusReset } =
      this.props.userForgotPasswordReducer;
    var button_submit = loadingReset ? (
      <input
        type="button"
        className="btn btn-primary btn-block"
        value="LOADING..."
      />
    ) : (
      <input
        type="submit"
        className="btn btn-primary btn-block"
        value="Xác nhận"
      />
    );
    var messageStatus = statusReset ? (
      <div className="mt-10">
        <span className="text-success">
          Mật khẩu của bạn đã được cập nhật thành công.
        </span>
      </div>
    ) : (
      ""
    );
    var { recheckPassword, password } = this.state;
    var elemntTextRecheckPassword = "";
    if (recheckPassword.length > 0 && password !== recheckPassword) {
      elemntTextRecheckPassword = (
        <span className="text-danger mt-10">
          Nhập lại mật khẩu không chính xác
        </span>
      );
    }
    return (
      <div>
        <form onSubmit={this.onSubmit}>
          <div className="row justify-content-center align-items-center">
            <div className="col-xs-4 col-sm-4 col-md-4 col-lg-4">
              <h5 className="text-center text-info mt-50">Đăt lại mật khẩu</h5>
              <div className="form-group row mt-20">
                <input
                  className="form-control"
                  placeholder="Mật khẩu mới"
                  name="password"
                  onChange={this.onChange}
                  type="password"
                  minLength={6}
                  required
                />
              </div>
              <div className="form-group row">
                <input
                  className="form-control"
                  placeholder="Nhập lại mật khẩu"
                  name="recheckPassword"
                  onChange={this.onChange}
                  type="password"
                  minLength={6}
                  required
                />
              </div>
              <div className="form-group">{elemntTextRecheckPassword}</div>
              <div className="form-group">{messageStatus}</div>
              <div className="form-group">
                <span className="text-danger">{message ? message : ""}</span>
              </div>
              <div className="form-group row mrb-100">{button_submit}</div>
            </div>
          </div>
        </form>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    userInfoReducer: state.userInfoReducer,
    userForgotPasswordReducer: state.userForgotPasswordReducer,
  };
};

const mapDispatchToProps = (dispatch) => ({
  resetPassword: (code, password) =>
    dispatch(resetPasswordRequest(code, password)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(memo(ResetPassword));
