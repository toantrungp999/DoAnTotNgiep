import React, { Component, memo } from "react";
import { connect } from "react-redux";
import "./products.css";
import { createProductRequest } from "../../../actions/productActions";
import { fectchBrandsRequest } from "../../../actions/brandActions";
import { fectchCategoriesRequest } from "../../../actions/categoryActions";
import Editor from "../../../components/common/Editor";
import { isNumber, isValidLength } from "../../../extentions/ArrayEx";

class CreateProductPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      brandId: -1,
      categoryId: -1,
      files: "",
      orgin: "",
      description: "",
      material: "",
      review: "",
      images: [],
      price: "",
      saleOff: "",
      errors: {
        name: "Chưa nhập",
        brandId: "Chưa chọn",
        categoryId: "Chưa chọn",
        price: "Chưa nhập",
        saleOff: "Chưa nhập",
        orgin: "Chưa nhập",
        description: "Chưa nhập",
        material: "Chưa nhập",
      },
      firstSubmit: false,
      isSubmit: false,
    };
  }

  componentDidMount() {
    if (!this.props.brandsReducer.brands) this.props.fectchBrands();
    if (!this.props.categoriesReducer.categories) this.props.fectchCategories();
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps) {
      const { loading, message } = nextProps.productCreateReducer;
      if (!loading && !message && this.state.isSubmit)
        this.props.history.push("/admin/products");
    }
  }

  onChange = (e) => {
    const target = e.target;
    let { name, value } = target;

    let errors = this.state.errors;
    const checkLength = isValidLength(value, 3, 500);
    let checkNumber;
    switch (name) {
      case "name":
        errors.name = !checkLength.valid ? checkLength.error : "";
        break;
      case "brandId":
        errors.brandId = value === "-1" ? "Chọn hãng" : "";
        break;
      case "categoryId":
        errors.categoryId = value === "-1" ? "Chọn loại" : "";
        break;
      case "description":
        errors.description = value.length > 500 ? "Nhập dưới 500 ký tự" : "";
        break;
      case "orgin":
        errors.orgin = value.length > 100 ? "Nhập dưới 100 ký tự" : "";
        break;
      case "material":
        errors.material = value.length > 500 ? "Nhập dưới 500 ký tự" : "";
        break;
      case "price":
        checkNumber = isNumber(value);
        errors.price = !checkNumber.valid ? checkNumber.error : "";
        if (errors.price.length === 0) {
          if (Number(value) < 1 || Number(value) > 9999999999) {
            errors.price = "Nhập từ 1 đến 9999999999";
          }
        }
        break;
      case "saleOff":
        checkNumber = isNumber(value);
        errors.saleOff = !checkNumber.valid ? checkNumber.error : "";
        if (errors.saleOff.length === 0) {
          if (Number(value) < 0 || Number(value) > 9999999999) {
            errors.saleOff = "Nhập từ 0 đến 9999999999";
          }
        }
        break;
      default:
        break;
    }

    if (name === "files") {
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

  htmlDecode = (input) => {
    var e = document.createElement("textarea");
    e.innerHTML = input;
    // handle case of empty input
    return e.childNodes.length === 0 ? "" : e.childNodes[0].nodeValue;
  };

  onSubmit = () => {
    var {
      name,
      brandId,
      price,
      saleOff,
      categoryId,
      material,
      description,
      orgin,
      files,
      errors,
    } = this.state;
    let review = this.getContentEditor();
    review = this.htmlDecode(review);

    if (this.validateForm(errors) && files) {
      var data = {
        name,
        brandId,
        price,
        saleOff,
        categoryId,
        material,
        description,
        orgin,
        review,
      };
      this.props.createProduct(files, data);
      this.setState({ isSubmit: true });
    }
    this.setState({
      firstSubmit: true,
    });
  };

  validateForm = (errors) => {
    let valid = true;
    Object.values(errors).forEach((val) => val.length > 0 && (valid = false));
    return valid;
  };

  render() {
    const { loading } = this.props.productCreateReducer;
    const { brands } = this.props.brandsReducer;
    const { categories } = this.props.categoriesReducer;
    const { errors, firstSubmit } = this.state;
    const brandsOption = brands
      ? brands.map((brand, index) => {
          return (
            <option key={brand._id} index={index} value={brand._id}>
              {brand.name}
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
    const button_submit = loading ? (
      <input type="button" className="btn btn-primary" value="LOADING..." />
    ) : (
      <input
        type="button"
        onClick={this.onSubmit}
        className="btn btn-primary"
        value="XÁC NHẬN"
      />
    );
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
    return (
      <div className="row mt-30">
        <div className="col-xs-1 col-sm-1 col-md-1 col-lg-1"></div>
        <div className="col-xs-10 col-sm-10 col-md-10 col-lg-10">
          <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
            <h3 className="text-info">Thêm sản phẩm</h3>
            <div className="row">
              <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                <div className="form-group">
                  <label>Tên sản phẩm(*)</label>
                  <input
                    name="name"
                    className={
                      "form-control" +
                      (firstSubmit && errors.name.length > 0
                        ? " invalid-input"
                        : "")
                    }
                    value={this.state.name}
                    onChange={this.onChange}
                  />
                  <div className="invalid-message text-center">
                    {firstSubmit ? errors.name : ""}
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-xs-6 col-sm-6 col-md-6 col-lg-6">
                <div className="form-group">
                  <label>Hãng(*)</label>
                  {brandsOption ? (
                    <select
                      className={
                        "form-control" +
                        (firstSubmit && errors.brandId.length > 0
                          ? " invalid-input"
                          : "")
                      }
                      name="brandId"
                      onChange={this.onChange}
                      value={this.state.brandId}
                    >
                      <option value={-1}>Chọn hãng</option>
                      {brandsOption}
                    </select>
                  ) : (
                    ""
                  )}
                  <div className="invalid-message text-center">
                    {firstSubmit ? errors.brandId : ""}
                  </div>
                </div>
                <div className="form-group">
                  <label>Xuất xứ</label>
                  <input
                    className={
                      "form-control" +
                      (firstSubmit && errors.orgin.length > 0
                        ? " invalid-input"
                        : "")
                    }
                    name="orgin"
                    value={this.state.orgin}
                    onChange={this.onChange}
                  />
                  <div className="invalid-message text-center">
                    {firstSubmit ? errors.orgin : ""}
                  </div>
                </div>
              </div>
              <div className="col-xs-6 col-sm-6 col-md-6 col-lg-6">
                <div className="form-group">
                  <label>Loại(*)</label>
                  {categoriesOption ? (
                    <select
                      className={
                        "form-control" +
                        (firstSubmit && errors.categoryId.length > 0
                          ? " invalid-input"
                          : "")
                      }
                      name="categoryId"
                      onChange={this.onChange}
                      value={this.state.categoryId}
                    >
                      <option value={-1}>Chọn loại sản phẩm</option>
                      {categoriesOption}
                    </select>
                  ) : (
                    ""
                  )}
                  <div className="invalid-message text-center">
                    {firstSubmit ? errors.categoryId : ""}
                  </div>
                </div>
                <div className="form-group">
                  <label>Chất liệu</label>
                  <input
                    className={
                      "form-control" +
                      (firstSubmit && errors.material.length > 0
                        ? " invalid-input"
                        : "")
                    }
                    name="material"
                    value={this.state.material}
                    onChange={this.onChange}
                  />
                  <div className="invalid-message text-center">
                    {firstSubmit ? errors.material : ""}
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
                      (firstSubmit && errors.description.length > 0
                        ? " invalid-input"
                        : "")
                    }
                    name="description"
                    value={this.state.description}
                    onChange={this.onChange}
                  />
                  <div className="invalid-message text-center">
                    {firstSubmit ? errors.description : ""}
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
                      (firstSubmit && errors.price.length > 0
                        ? " invalid-input"
                        : "")
                    }
                    name="price"
                    value={this.state.price}
                    onChange={this.onChange}
                  />
                  <div className="invalid-message text-center">
                    {firstSubmit ? errors.price : ""}
                  </div>
                </div>
              </div>
              <div className="col-xs-6 col-sm-6 col-md-6 col-lg-6">
                <div className="form-group">
                  <label>Giảm giá(*)</label>
                  <input
                    className={
                      "form-control" +
                      (firstSubmit && errors.saleOff.length > 0
                        ? " invalid-input"
                        : "")
                    }
                    name="saleOff"
                    value={this.state.saleOff}
                    onChange={this.onChange}
                  />
                  <div className="invalid-message text-center">
                    {firstSubmit ? errors.saleOff : ""}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
              <div className="form-group">{images}</div>
              <input
                className="product-create-page__uploadfile--none"
                type="file"
                multiple
                accept="image/*"
                name="files"
                id="files"
                onChange={this.onChange}
              />
              <div className="form-group">
                <label
                  className={
                    "product-create-page__uploadfile--btn" +
                    (firstSubmit && this.state.images.length === 0
                      ? " input-focus"
                      : "")
                  }
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
                <Editor />
              </div>
              <div className="form-group">{button_submit}</div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    brandsReducer: state.brandsReducer,
    categoriesReducer: state.categoriesReducer,
    productCreateReducer: state.productCreateReducer,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    createProduct: (files, data) => {
      dispatch(createProductRequest(files, data));
    },
    fectchBrands: () => {
      dispatch(fectchBrandsRequest());
    },
    fectchCategories: () => {
      dispatch(fectchCategoriesRequest());
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(memo(CreateProductPage));
