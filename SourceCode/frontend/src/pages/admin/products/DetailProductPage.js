import React, { Component, memo } from "react";
import { connect } from "react-redux";
import { fectchBrandsRequest } from "../../../actions/brandActions";
import { fectchCategoriesRequest } from "../../../actions/categoryActions";
import {
  adminFectchProductRequest,
  updateProductRequest,
} from "../../../actions/productActions";
import {
  isValidLength,
  findIndexById,
  isNumber,
} from "../../../extentions/ArrayEx";
import Editor from "../../../components/common/Editor";
import Loading from "../../../components/common/loading/Loading";
import NotFound from "../notFound/NotFound";
import ROLES from "../../../constants/Roles";

class DetailProductPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      _id: "",
      name: "",
      brandId: -1,
      categoryId: -1,
      file: "",
      images: "",
      price: "",
      saleOff: "",
      orgin: "",
      description: "",
      material: "",
      status: true,
      isEditing: false,
      errors: {
        name: "",
        brandId: "",
        categoryId: "",
        price: "",
        saleOff: "",
        orgin: "",
        description: "",
        material: "",
        status: "",
      },
      showAlert: false,
    };
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps) {
      let { product } = nextProps.productDetailReducer;
      if (product) {
        const {
          name,
          brandId,
          categoryId,
          images,
          price,
          orgin,
          saleOff,
          material,
          description,
          review,
          status,
        } = product;
        this.setState({
          name,
          brandId,
          categoryId: categoryId._id ? categoryId._id : categoryId,
          images,
          price,
          orgin,
          saleOff,
          material,
          description,
          review,
          status,
        });
      }
    }
  }

  componentDidMount() {
    const _id = this.props.match.params._id;
    if (_id) {
      this.setState({
        _id: _id,
      });
      if (!this.props.brandsReducer.brands) this.props.fectchBrands();
      if (!this.props.categoriesReducer.categories)
        this.props.fectchCategories();
      this.props.fectchProduct(_id);
    } else this.history.push("/notfound");
  }

  onChange = (e) => {
    var target = e.target;
    var { name, value } = target;

    let errors = this.state.errors;
    var checkLength = isValidLength(value, 3, 500);

    switch (name) {
      case "name":
        errors.name = !checkLength.valid ? checkLength.error : "";
        break;
      case "frontCamera":
        errors.frontCamera = value.length > 500 ? "Nhập dưới 500 ký tự" : "";
        break;
      case "backCamera":
        errors.backCamera = value.length > 500 ? "Nhập dưới 500 ký tự" : "";
        break;
      case "cpu":
        errors.cpu = value.length > 500 ? "Nhập dưới 500 ký tự" : "";
        break;
      case "pin":
        errors.pin = !checkLength.valid ? checkLength.error : "";
        break;
      case "screen":
        errors.screen = !checkLength.valid ? checkLength.error : "";
        break;
      case "os":
        errors.os = value.length > 500 ? "Nhập dưới 500 ký tự" : "";
        break;
      case "expired":
        errors.expired = isNumber(value).error;
        if (errors.expired.length === 0) {
          if (Number(value) < 0 || Number(value) > 120) {
            errors.expired = "Nhập từ 0 đến 120";
          }
        }
        break;
      default:
        break;
    }

    if (name === "status") value = target.value === "true" ? true : false;
    else if (name === "files") {
      var images = [];
      value = target.files;
      for (let i = 0; i < value.length; i++)
        images.push(URL.createObjectURL(value[i]));
      this.setState({ images });
    }
    this.setState({
      [name]: value,
    });
  };

  getContentEditor = () => {
    let editor = document.getElementById("editor");
    return editor.innerHTML;
  };

  onSubmit = () => {
    const isEditing = this.state.isEditing;
    if (isEditing && this.validateForm(this.state.errors)) {
      const {
        _id,
        files,
        name,
        brandId,
        categoryId,
        price,
        orgin,
        saleOff,
        material,
        description,
        status,
      } = this.state;
      const review = this.getContentEditor();
      this.setState({ review });
      const data = {
        _id,
        name,
        brandId,
        categoryId,
        images: this.props.productDetailReducer.product.images,
        price,
        orgin,
        saleOff,
        material,
        description,
        review,
        status,
      };
      this.props.updateProduct(files, data);
      this.setState({
        isEditing: !isEditing,
        showAlert: true,
      });
    }
  };

  onEdit = () => {
    const { userInfo } = this.props.userInfoReducer;
    const role = userInfo.role;
    if (role === ROLES.ADMIN || role === ROLES.SUPER_ADMIN) {
      const { product } = this.props.productDetailReducer;
      if (product) {
        this.setState({
          isEditing: !this.state.isEditing,
        });
      }
    }
  };

  onCancel = () => {
    this.setState({
      isEditing: !this.state.isEditing,
      errors: {
        name: "",
        brandId: "",
        categoryId: "",
        price: "",
        saleOff: "",
        orgin: "",
        description: "",
        material: "",
        status: "",
      },
    });

    if (this.props.productDetailReducer.product) {
      const {
        name,
        brandId,
        categoryId,
        images,
        price,
        orgin,
        saleOff,
        material,
        description,
        review,
        status,
      } = this.props.productDetailReducer.product;
      this.setState({
        name,
        brandId,
        categoryId,
        images,
        price,
        orgin,
        saleOff,
        material,
        description,
        review,
        status,
      });
    }
  };

  validateForm = (errors) => {
    let valid = true;
    Object.values(errors).forEach((val) => val.length > 0 && (valid = false));
    return valid;
  };

  onHideAlert = () => {
    this.setState({ showAlert: false });
  };

  render() {
    const { loading } = this.props.productDetailReducer;
    const { errors } = this.state;
    if (loading)
      return (
        <div>
          <Loading />
        </div>
      );
    else if (this.props.productDetailReducer.product === null) {
      return <NotFound></NotFound>;
    } else {
      const {
        name,
        brandId,
        categoryId,
        price,
        orgin,
        saleOff,
        material,
        description,
        review,
        status,
        isEditing,
      } = this.state;
      const { brands } = this.props.brandsReducer;
      const { categories } = this.props.categoriesReducer;
      const brandsOption = brands
        ? brands.map((brandId, index) => {
            return (
              <option key={brandId._id} index={index} value={brandId._id}>
                {brandId.name}
              </option>
            );
          })
        : "";
      const categoriesOption = categories
        ? categories.map((category, index) => {
            return (
              <option key={category._id} index={index} value={category._id}>
                {category.name}
              </option>
            );
          })
        : "";
      const brandIndex = brands ? findIndexById(brands, brandId) : -1;
      const categoryIndex = categories
        ? findIndexById(categories, categoryId)
        : -1;
      let brandName = "";
      if (brandIndex !== -1) brandName = brands ? brands[brandIndex].name : "";
      let categoryName = "";
      if (categoryIndex !== -1)
        categoryName = categories ? categories[categoryIndex].name : "";
      const images = this.state.images
        ? this.state.images.map((image, index) => {
            return (
              <img
                key={index}
                index={index}
                className="image-update-product mr-all-2"
                alt="Hình sản phẩm"
                src={image}
              ></img>
            );
          })
        : "";
      const { userInfo } = this.props.userInfoReducer;
      const role = userInfo.role;
      return (
        <div className="mt-30">
          <div className="row">
            <div className="col-xs-1 col-sm-1 col-md-1 col-lg-1"></div>
            <div className="col-xs-10 col-sm-10 col-md-10 col-lg-10">
              <div className="needs-validation">
                <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                  <h3 className="text-info">Thông tin sản phẩm</h3>
                  <div className="form-group">
                    {!this.state.isEditing &&
                    (role === ROLES.ADMIN || role === ROLES.SUPER_ADMIN) ? (
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={this.onEdit}
                      >
                        Sửa
                      </button>
                    ) : null}
                  </div>
                  {this.state.isEditing ? (
                    <div className="row">
                      <div className="col-xs-4 col-sm-4 col-md-4 col-lg-4"></div>
                      <div className="col-xs-4 col-sm-4 col-md-4 col-lg-4">
                        <button
                          type="button"
                          style={{ margin: "20px" }}
                          className="btn btn-success"
                          onClick={this.onSubmit}
                        >
                          Lưu
                        </button>
                        <button
                          type="button"
                          style={{ margin: "20px" }}
                          className="btn btn-danger"
                          onClick={this.onCancel}
                        >
                          Hủy
                        </button>
                      </div>
                    </div>
                  ) : null}
                  <div className="row">
                    <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                      <div className="form-group">
                        <label>Tên sản phẩm(*)</label>
                        <input
                          name="name"
                          className={
                            "form-control" +
                            (errors.name.length > 0 ? " invalid-input" : "")
                          }
                          value={name}
                          onChange={this.onChange}
                          readOnly={isEditing ? false : true}
                        />
                        <div className="invalid-message text-center">
                          {errors.name || ""}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-xs-6 col-sm-6 col-md-6 col-lg-6">
                      <div className="form-group">
                        <label>Hãng(*)</label>
                        {isEditing ? (
                          brandsOption ? (
                            <select
                              className={
                                "form-control" +
                                (errors.brandId.length > 0
                                  ? " invalid-input"
                                  : "")
                              }
                              name="brandId"
                              value={brandId}
                              onChange={this.onChange}
                            >
                              {brandsOption}
                            </select>
                          ) : (
                            ""
                          )
                        ) : (
                          <input
                            name="brandId"
                            value={brandName}
                            onChange={this.onChange}
                            className="form-control"
                            readOnly
                          />
                        )}
                        <div className="invalid-message text-center">
                          {errors.brandId || ""}
                        </div>
                      </div>
                      <div className="form-group">
                        <label>Xuất xứ</label>
                        <input
                          className={
                            "form-control" +
                            (errors.orgin.length > 0 ? " invalid-input" : "")
                          }
                          name="orgin"
                          value={orgin}
                          onChange={this.onChange}
                          readOnly={isEditing ? false : true}
                        />
                        <div className="invalid-message text-center">
                          {errors.orgin || ""}
                        </div>
                      </div>
                    </div>
                    <div className="col-xs-6 col-sm-6 col-md-6 col-lg-6">
                      <div className="form-group">
                        <label>Loại(*)</label>
                        {isEditing ? (
                          categoriesOption ? (
                            <select
                              className={
                                "form-control" +
                                (errors.categoryId.length > 0
                                  ? " invalid-input"
                                  : "")
                              }
                              name="categoryId"
                              value={categoryId}
                              onChange={this.onChange}
                            >
                              {categoriesOption}
                            </select>
                          ) : (
                            ""
                          )
                        ) : (
                          <input
                            name="categoryId"
                            value={categoryName}
                            onChange={this.onChange}
                            className="form-control"
                            readOnly
                          />
                        )}
                        <div className="invalid-message text-center">
                          {errors.categoryId || ""}
                        </div>
                      </div>
                      <div className="form-group">
                        <label>Chất liệu</label>
                        <input
                          className={
                            "form-control" +
                            (errors.material.length > 0 ? " invalid-input" : "")
                          }
                          name="material"
                          value={material}
                          onChange={this.onChange}
                          readOnly={isEditing ? false : true}
                        />
                        <div className="invalid-message text-center">
                          {errors.material || ""}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                      <div className="form-group">
                        <label>Mô tả sản phẩm</label>
                        <textarea
                          className={
                            "form-control" +
                            (errors.description.length > 0
                              ? " invalid-input"
                              : "")
                          }
                          name="description"
                          value={description}
                          onChange={this.onChange}
                          readOnly={isEditing ? false : true}
                        />
                        <div className="invalid-message text-center">
                          {errors.description || ""}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-xs-6 col-sm-6 col-md-6 col-lg-6">
                      <div className="form-group">
                        <label>Giá(*)</label>
                        <input
                          className={
                            "form-control" +
                            (errors.price.length > 0 ? " invalid-input" : "")
                          }
                          name="price"
                          value={price}
                          onChange={this.onChange}
                          readOnly={isEditing ? false : true}
                        />
                        <div className="invalid-message text-center">
                          {errors.price || ""}
                        </div>
                      </div>
                    </div>
                    <div className="col-xs-6 col-sm-6 col-md-6 col-lg-6">
                      <div className="form-group">
                        <label>Giảm giá(*)</label>
                        <input
                          className={
                            "form-control" +
                            (errors.saleOff.length > 0 ? " invalid-input" : "")
                          }
                          name="saleOff"
                          value={saleOff}
                          onChange={this.onChange}
                          readOnly={isEditing ? false : true}
                        />
                        <div className="invalid-message text-center">
                          {errors.saleOff || ""}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-xs-4 col-sm-4 col-md-4 col-lg-4"></div>
                  <div className="col-xs-4 col-sm-4 col-md-4 col-lg-4">
                    <div className="form-group">
                      <label>Trạng thái</label>
                      <select
                        className={
                          "form-control" +
                          (errors.status.length > 0 ? " invalid-input" : "")
                        }
                        name="status"
                        onChange={this.onChange}
                        value={status}
                        readOnly={isEditing ? false : true}
                      >
                        <option value={true}>Hoạt động</option>
                        <option value={false}>Tạm dừng</option>
                      </select>
                      <div className="invalid-message text-center">
                        {errors.status}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                    <div className="form-group">{images}</div>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      className="admin-detail-product__upload-file--none"
                      name="files"
                      id="files"
                      onChange={this.onChange}
                      readOnly={isEditing ? false : true}
                    />
                    <div className="form-group">
                      <label
                        className="admin-detail-product__upload-file--btn"
                        htmlFor="files"
                      >
                        CHỌN ẢNH
                      </label>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                    <div className="form-group">
                      <label>Review sản phẩm</label>
                      <Editor content={review} />
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
}

const mapStateToProps = (state) => {
  return {
    userInfoReducer: state.userInfoReducer,
    productDetailReducer: state.productDetailReducer,
    brandsReducer: state.brandsReducer,
    categoriesReducer: state.categoriesReducer,
    productOptionsReducer: state.productOptionsReducer,
  };
};

const mapDispatchToProps = (dispatch) => ({
  fectchBrands: () => {
    dispatch(fectchBrandsRequest());
  },
  fectchCategories: () => {
    dispatch(fectchCategoriesRequest());
  },
  fectchProduct: (_id) => {
    dispatch(adminFectchProductRequest(_id));
  },
  updateProduct: (files, data) => {
    dispatch(updateProductRequest(files, data));
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(memo(DetailProductPage));
