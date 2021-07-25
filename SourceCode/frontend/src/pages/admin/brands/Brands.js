import React, { Component, memo } from "react";
import { connect } from "react-redux";
import {
  fectchBrandsRequest,
  CreateBrandRequest,
  updateBrandRequest,
} from "../../../actions/brandActions";
import BrandItem from "../../../components/admin/brandItem/BrandItem";
import CreateBrand from "../../../components/admin/brandItem/CreateBrand";
import Loading from "../../../components/common/loading/Loading";
import { Link } from "react-router-dom";

class Brands extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isAdding: false,
      showAlert: false,
    };
  }

  componentDidMount() {
    this.props.fectchBrands();
  }

  onCreateBrand = (data) => {
    this.props.CreateBrand(data);
    this.setState({ showAlert: true });
  };

  onUpdateBrand = (data) => {
    this.props.updateBrand(data);
    this.setState({ showAlert: true });
  };

  onOpenAddForm = () => {
    this.setState({
      isAdding: !this.state.isAdding,
    });
  };

  onCloseAddForm = () => {
    this.setState({
      isAdding: false,
    });
  };

  onHideAlert = () => {
    this.setState({ showAlert: false });
  };

  render() {
    var { loading, createLoading, updateLoading, brands } =
      this.props.brandsReducer;
    if (loading)
      return (
        <div>
          <Loading />
        </div>
      );
    else {
      var brandItems = brands
        ? brands.map((brand, index) => {
            return (
              <BrandItem
                onUpdateBrand={this.onUpdateBrand}
                updateLoading={updateLoading}
                key={brand._id}
                index={index}
                brand={brand}
              />
            );
          })
        : "";

      return (
        <div>
          <h3>Danh sách hãng</h3>
          <div className="flex">
            <div className="flex-fill"></div>
            <div className="flex-fill"></div>
            <div className="add-item-admin pr-5">
              <Link
                to="#"
                onClick={(e) => {
                  e.preventDefault();
                  this.onOpenAddForm();
                }}
              >
                <i className="fas fa-plus"></i>Thêm hãng mới
              </Link>
            </div>
          </div>

          <div className="">
            <table className="table table-product mt-2">
              <thead>
                <tr>
                  <th>Tên hãng</th>
                  <th>Mô tả</th>
                  <th>Trạng thái</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {!createLoading && this.state.isAdding ? (
                  <CreateBrand
                    onCloseAddForm={this.onCloseAddForm}
                    onCreateBrand={this.onCreateBrand}
                  />
                ) : null}
                {brandItems}
              </tbody>
            </table>
          </div>
        </div>
      );
    }
  }
}

const mapStateToProps = (state) => {
  return {
    brandsReducer: state.brandsReducer,
  };
};

const mapDispatchToProps = (dispatch, props) => {
  return {
    fectchBrands: () => {
      dispatch(fectchBrandsRequest());
    },
    CreateBrand: (data) => {
      dispatch(CreateBrandRequest(data));
    },
    updateBrand: (data) => {
      dispatch(updateBrandRequest(data));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(memo(Brands));
