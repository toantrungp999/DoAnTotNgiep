import React, { Component, memo } from "react";
import { connect } from "react-redux";
import {
  fectchDetailUserRequest,
  updateStatusRoleRequest,
} from "../../../actions/managerUsersActions";
import NotFound from "../notFound/NotFound";
import Loading from "../../../components/common/loading/Loading";
import ROLES from "../../../constants/Roles";

class DetailUser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      _id: "",
      name: "",
      email: "",
      phoneNumber: "",
      addresses: "",
      male: "",
      image: "",
      role: "",
      status: "",
      showAlert: false,
    };
  }

  componentDidMount() {
    var _id = this.props.match.params._id;
    if (_id) {
      this.setState({
        _id: _id,
      });
      this.props.fectchDetailUser(_id);
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps) {
      var { user } = nextProps.userDetailReducer;
      if (user) {
        this.setState({
          name: user.name,
          email: user.email,
          phoneNumber: user.phoneNumber,
          addresses: user.addresses,
          male: user.male,
          image: user.image,
          role: user.role,
          status: user.status,
        });
      }
    }
  }

  onChange = (e) => {
    var target = e.target;
    var name = target.name;
    var value = target.value;
    if (name === "male" || name === "status") {
      value = target.value === "true" ? true : false;
    }
    this.setState({
      [name]: value,
    });
  };

  onSubmit = (e) => {
    e.preventDefault();
    this.props.updateStatusRole({
      _id: this.state._id,
      role: this.state.role,
      status: this.state.status,
    });
    this.setState({ showAlert: true });
  };

  render() {
    var { loading } = this.props.userDetailReducer;
    if (loading)
      return (
        <div>
          <Loading />
        </div>
      );
    else if (this.props.userDetailReducer.user === null)
      return <NotFound></NotFound>;
    else {
      var male = this.state.male ? "Nam" : "Nữ";
      if (this.state.male === undefined) male = "------";
      var addresses = this.state.addresses;
      var adressItems = addresses
        ? addresses.map((address, index) => {
            return (
              <textarea
                index={index}
                key={address._id}
                readOnly
                value={
                  address.ward + ", " + address.district + ", " + address.city
                }
                className="form-control mt-3"
              />
            );
          })
        : null;

      var button_submit = loading ? (
        <input type="button" className="btn btn-primary" value="LOADING..." />
      ) : (
        <input type="submit" className="btn btn-primary" value="XÁC NHẬN" />
      );

      return (
        <div className="row mt-30">
          <div className="col-3 mt-30">
            <img
              className="avatar-upload mt-30"
              alt={this.state.name}
              src={this.state.image}
            />
            <h5 className="mt-10">{this.state.name}</h5>
          </div>
          <div className="col-xs-6 col-sm-6 col-md-6 col-lg-6">
            <form onSubmit={this.onSubmit}>
              <h3 className="text-info">Chỉnh sửa trạng thái và quyền hạn</h3>
              <div className="form-group row mt-30">
                <div className="col-xs-3 col-sm-3 col-md-3 col-lg-3">
                  <label>Email</label>
                </div>
                <div className="col-xs-7 col-sm-7 col-md-7 col-lg-7">
                  <input
                    readOnly
                    value={this.state.email}
                    className="form-control"
                  />
                </div>
              </div>
              <div className="form-group row">
                <div className="col-xs-3 col-sm-3 col-md-3 col-lg-3">
                  <label>Địa chỉ</label>
                </div>
                <div className="col-xs-7 col-sm-7 col-md-7 col-lg-7">
                  {adressItems}
                </div>
              </div>
              <div className="form-group row">
                <div className="col-xs-3 col-sm-3 col-md-3 col-lg-3">
                  <label>Số điện thoại</label>
                </div>
                <div className="col-xs-7 col-sm-7 col-md-7 col-lg-7">
                  <input
                    readOnly
                    className="form-control"
                    value={this.state.phoneNumber}
                  />
                </div>
              </div>
              <div className="form-group row">
                <div className="col-xs-3 col-sm-3 col-md-3 col-lg-3">
                  <label>Giới tính</label>
                </div>
                <div className="col-xs-7 col-sm-7 col-md-7 col-lg-7">
                  <input readOnly value={male} className="form-control" />
                </div>
              </div>
              <div className="form-group row">
                <div className="col-xs-3 col-sm-3 col-md-3 col-lg-3">
                  <label>Quyền hạn</label>
                </div>

                <div className="col-xs-7 col-sm-7 col-md-7 col-lg-7">
                  <select
                    className="form-control"
                    name="role"
                    onChange={this.onChange}
                    value={this.state.role}
                  >
                    <option value={ROLES.SUPER_ADMIN}>Super Admin</option>
                    <option value={ROLES.ADMIN}>Admin</option>
                    <option value={ROLES.CUSTOMER}>
                      Tài khoản bình thường
                    </option>
                  </select>
                </div>
              </div>

              <div className="form-group row">
                <div className="col-xs-3 col-sm-3 col-md-3 col-lg-3">
                  <label>Trạng thái</label>
                </div>
                <div className="col-xs-7 col-sm-7 col-md-7 col-lg-7">
                  <select
                    className="form-control"
                    name="status"
                    onChange={this.onChange}
                    value={this.state.status}
                  >
                    <option value={true}>Hoạt động</option>
                    <option value={false}>Cấm</option>
                  </select>
                </div>
              </div>
              <br />
              <div className="form-group text-center">{button_submit}</div>
            </form>
          </div>
        </div>
      );
    }
  }
}

const mapStateToProps = (state) => {
  return {
    userDetailReducer: state.userDetailReducer,
  };
};

const mapDispatchToProps = (dispatch) => ({
  fectchDetailUser: (_id) => {
    dispatch(fectchDetailUserRequest(_id));
  },
  updateStatusRole: (data) => {
    dispatch(updateStatusRoleRequest(data));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(memo(DetailUser));
