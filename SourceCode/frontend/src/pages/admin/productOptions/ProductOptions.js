import React, { Component, memo } from "react";
import { connect } from "react-redux";
import ColorOptions from "../../../components/admin/options/ColorOptions";
import SizeOptions from "../../../components/admin/options/SizeOptions";
import QuantityOptions from "../../../components/admin/options/QuantityOptions";
import NotFound from "../notFound/NotFound";
import {
  fectchColorOptionsRequest,
  adminFectchQuantityOptionsRequest,
  fectchSizeOptionsRequest,
  createColorOptionRequest,
  createQuantityOptionRequest,
  createSizeOptionRequest,
  updateColorOptionRequest,
  updateQuantityOptionRequest,
  updateSizeOptionRequest,
} from "../../../actions/productOptionActions";
import "./style.css";

class ProductOptions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      _id: -1,
      isShowColorOption: false,
      isShowProductOption: false,
      showAlert: false,
      alertType: "",
      alertMessage: "",
    };
  }

  componentDidMount() {
    let _id = this.props.match.params._id;
    if (_id) {
      this.setState({ _id });
      this.props.fectchColorOptions(_id);
      this.props.fectchSizeOptions(_id);
      this.props.fectchQuantityOptions(_id);
    }
  }

  showAlert = (type, message) => {
    this.setState({
      showAlert: true,
      alertType: type,
      alertMessage: message,
    });
  };

  onHideAlert = () => {
    this.setState({ showAlert: false });
  };

  createColorOption = (file, data) => {
    this.showAlert("color", "Tạo tùy chọn màu");
    this.props.createColorOption(file, data);
  };

  updateColorOption = (file, data) => {
    this.showAlert("color", "Cập nhật tùy chọn màu");
    this.props.updateColorOption(file, data);
  };

  createSizeOption = (data) => {
    this.showAlert("size", "Tạo tùy chọn kích cỡ");
    this.props.createSizeOption(data);
  };

  updateSizeOption = (data) => {
    this.showAlert("size", "Cập nhật tùy chọn hình");
    this.props.updateSizeOption(data);
  };

  createQuantityOption = (data) => {
    this.props.createQuantityOption(data);
    this.showAlert("quantity", "Tạo số lượng");
  };

  updateQuantityOption = (data) => {
    this.props.updateQuantityOption(data);
    this.showAlert("quantity", "Cập nhật số lượng");
  };

  render() {
    const { userInfo } = this.props.userInfoReducer;
    const role = userInfo.role;
    if (this.props.productOptionsReducer.colorOptions === null) {
      return <NotFound></NotFound>;
    }
    return (
      <div>
        <div className="row">
          <div className="col-xs-6 col-sm-6 col-md-6 col-lg-6">
            <h4>Màu</h4>
            <ColorOptions
              role={role}
              _id={this.state._id}
              onCreateColorOption={this.createColorOption}
              onUpdateColorOption={this.updateColorOption}
              productOptionsReducer={this.props.productOptionsReducer}
            />
          </div>
          <div className="col-xs-6 col-sm-6 col-md-6 col-lg-6">
            <h4>Kích cỡ</h4>
            <SizeOptions
              role={role}
              _id={this.state._id}
              onCreateSizeOption={this.createSizeOption}
              onUpdateSizeOption={this.updateSizeOption}
              productOptionsReducer={this.props.productOptionsReducer}
            />
          </div>
        </div>
        <div className="row mt-30">
          <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
            <QuantityOptions
              _id={this.state._id}
              fectchQuantityOptions={this.props.fectchQuantityOptions}
              role={role}
              onCreateQuantityOption={this.createQuantityOption}
              onUpdateQuantityOption={this.updateQuantityOption}
              productOptionsReducer={this.props.productOptionsReducer}
            />
          </div>
        </div>
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    userInfoReducer: state.userInfoReducer,
    productOptionsReducer: state.productOptionsReducer,
  };
};

const mapDispatchToProps = (dispatch) => ({
  fectchColorOptions: (_id) => {
    dispatch(fectchColorOptionsRequest(_id));
  },
  fectchSizeOptions: (_id) => {
    dispatch(fectchSizeOptionsRequest(_id));
  },
  fectchQuantityOptions: (_id) => {
    dispatch(adminFectchQuantityOptionsRequest(_id));
  },
  createColorOption: (file, data) => {
    dispatch(createColorOptionRequest(file, data));
  },
  updateColorOption: (file, data) => {
    dispatch(updateColorOptionRequest(file, data));
  },
  createQuantityOption: (data) => {
    dispatch(createQuantityOptionRequest(data));
  },
  updateQuantityOption: (data) => {
    dispatch(updateQuantityOptionRequest(data));
  },
  createSizeOption: (data) => {
    dispatch(createSizeOptionRequest(data));
  },
  updateSizeOption: (data) => {
    dispatch(updateSizeOptionRequest(data));
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(memo(ProductOptions));
