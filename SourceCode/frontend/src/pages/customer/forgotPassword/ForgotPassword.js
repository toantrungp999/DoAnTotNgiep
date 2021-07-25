import React, { Component, memo } from "react";
import { forgotPasswordRequest } from "./../../../actions/userActions";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
class ForgotPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
    };
  }

  useEffect = (userInfo) => {
    const redirect = this.props.location.search
      ? this.props.location.search.split("=")[1]
      : "/";
    if (userInfo) this.props.history.push(redirect);
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
      var { userInfo } = nextProps.userInfoReducer;
      this.useEffect(userInfo);
    }
  }

  componentDidMount() {
    var { userInfo } = this.props.userInfoReducer;
    this.useEffect(userInfo);
  }

  onSubmit = (e) => {
    e.preventDefault();
    const email = this.state.email.trim();
    if (email.length > 0) this.props.forgotPassword(email);
  };

  render() {
    var { loadingForgot, statusForgot } = this.props.userForgotPasswordReducer;
    var button_submit = loadingForgot ? (
      <Link to="#" className="btn btn-primary">
        LOADING...
      </Link>
    ) : (
      <Link to="#" onClick={this.onSubmit} className="btn btn-primary">
        Xác nhận
      </Link>
    );
    var messageStatus = statusForgot ? (
      <div className="mt-10">
        <span className="text-success">
          Link thay đổi mật khẩu đã được gửi về Email của bạn. Vui lòng kiểm trả
          Email của bạn
        </span>
      </div>
    ) : (
      ""
    );
    return (
      <div>
        {/* <form onSubmit={this.onSubmit}>
                <div className="row justify-content-center align-items-center">
                    <div className="col-xs-4 col-sm-4 col-md-4 col-lg-4">
                        <h5 className="text-center text-info mt-50">Nhập Email để được cấp lại mật khẩu</h5>
                        <div className="form-group row">
                            <input className="form-control" name="email" onChange={this.onChange} type="email" minLength={15} required />
                        </div>
                        <div className="form-group">
                            {messageStatus}
                        </div>
                        <div className="form-group">
                        </div>
                        <div className="form-group row mrb-100">
                            {button_submit}
                        </div>
                    </div>
                </div>
            </form> */}
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-5">
              <div className="card shadow-lg border-0 rounded-lg mt-5">
                <div className="card-header">
                  <h3 className="text-center font-weight-light my-4">
                    Đặt lại mật khẩu
                  </h3>
                </div>
                <div className="_card-body">
                  <div className="small mb-3 text-muted">
                    Nhập email. Chúng tôi sẽ gữi link đặt lại mật khẩu tới email
                    của bạn
                  </div>
                  <form>
                    <div className="form-group">
                      <label className="small mb-1" for="inputEmailAddress">
                        Email
                      </label>
                      <input
                        className="form-control py-4"
                        name="email"
                        onChange={this.onChange}
                        type="email"
                        minLength={15}
                        required
                        placeholder="Nhập địa chỉ email"
                      />
                    </div>
                    <div className="form-group d-flex align-items-center justify-content-between mt-4 mb-0">
                      <Link className="small" to="/login">
                        Đăng nhập
                      </Link>
                      {button_submit}
                    </div>
                    <div className="form-group">{messageStatus}</div>
                  </form>
                </div>
                <div className="card-footer text-center">
                  <div className="small">
                    <Link to="/register">Chưa có tài khoản? Đăng ký!</Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
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
  forgotPassword: (email) => dispatch(forgotPasswordRequest(email)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(memo(ForgotPassword));
