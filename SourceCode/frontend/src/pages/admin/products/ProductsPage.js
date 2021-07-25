import React, { Component, memo } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { adminFectchProductsRequest } from "../../../actions/productActions";
import { fectchCategoriesRequest } from "../../../actions/categoryActions";
import Paging from "../../../components/common/paging/Paging";
import ProductItem from "../../../components/admin/productItem/ProductItem";
import SearchProducts from "../../../components/admin/search/SearchProducts";
import Loading from "../../../components/common/loading/Loading";
import Select from "../../../components/common/formField/Select";
import queryString from "query-string";
import "./ProductsPage.css";

class ProductsPage extends Component {
  state = {
    search: "",
    categoryGroup: "",
    category: "all",
    status: "all",
    page: "1",
  };
  componentDidMount() {
    let { search, category, status, page } = queryString.parse(
      this.props.location.search
    );
    search = search ? search : "";
    category = category ? category : "all";
    status = status ? status : "all";
    page = page ? page : "1";
    this.setState({ search, category, status, page });
    this.props.fectchProducts(search, category, status, page);
    this.props.fectchCategories();
  }

  onChange = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  onSubmit = () => {
    let { search, category, status, page } = this.state;
    this.props.fectchProducts(search, category, status, page);
    this.props.history.push({
      pathname: "/admin/products",
      search: `?search=${search}&category=${category}&status=${status}&page=${page}`,
    });
  };

  onFetchData = (paging) => {
    this.setState({ page: paging.toString() });
    this.onSubmit();
  };

  render() {
    const { loading, products, pagingInfo } = this.props.productsReducer;
    const { categories } = this.props.categoriesReducer;
    const categoryOptions = categories
      ? categories.map((category) => {
          return { value: category._id, label: category.name };
        })
      : [];
    categoryOptions.unshift({ value: "all", label: "Tất cả" });
    const statusOptions = [
      { value: "all", label: "Tất cả" },
      { value: "true", label: "Còn bán" },
      { value: "false", label: "Ngưng bán" },
    ];
    let loadingComponent;
    let elementData;
    if (loading)
      loadingComponent = (
        <div>
          <Loading />
        </div>
      );
    else {
      elementData =
        products && products.length > 0 ? (
          products.map((product, index) => {
            return (
              <ProductItem key={product._id} index={index} product={product} />
            );
          })
        ) : (
          <tr>
            <td className="no-data" colSpan={7}>
              Không tìm thấy sản phẩm
            </td>
          </tr>
        );
    }
    return (
      <div className="admin-product-page">
        <h3>Danh sách sản phẩm</h3>
        <div className="add-product">
          <Link to="/admin/products/create">
            <i className="fas fa-plus"></i>Thêm mới sản phẩm
          </Link>
        </div>
        <div className="filter-section">
          <SearchProducts
            history={this.props.history}
            onChange={this.onChange}
            search={this.state.search}
            // searchProducts={this.props.searchProducts} productsReducer={this.props.productsReducer}
          />
          <div className="">
            <Select
              name="category"
              value={this.state.category}
              firstSubmit={false}
              label="Loại"
              placeHolder="Chọn loại"
              labelWidth="100px"
              onChange={this.onChange}
              rules={[]}
              options={categoryOptions}
            />
          </div>
          <div className="">
            <Select
              name="status"
              value={this.state.status}
              firstSubmit={false}
              label="Trạng thái"
              placeHolder="Chọn trạng thái"
              labelWidth="200px"
              onChange={this.onChange}
              rules={[]}
              options={statusOptions}
            />
          </div>
          <div>
            <button className="btn-filter" onClick={this.onSubmit}>
              Lọc
            </button>
          </div>
        </div>
        {loading ? (
          loadingComponent
        ) : (
          <>
            <table className="table table-product mt-2">
              <thead>
                <tr>
                  <th className="align-middle">Tên sản phẩm</th>
                  <th className="align-middle">Hãng</th>
                  <th className="align-middle">Loại</th>
                  <th className="align-middle">Xuất xứ</th>
                  <th className="align-middle">Giá</th>
                  <th>Trạng thái</th>
                  <th colSpan="2">Thông tin</th>
                </tr>
              </thead>
              <tbody>{elementData}</tbody>
            </table>
            <Paging
              onFetchData={this.onFetchData}
              pagingInfo={pagingInfo}
              loading={loading}
              location={this.props.location}
            />
          </>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    productsReducer: state.productsReducer,
    categoriesReducer: state.categoriesReducer,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fectchCategories: () => {
      dispatch(fectchCategoriesRequest(true));
    },
    fectchProducts: (key, categoryGroup, category, status, page) => {
      dispatch(
        adminFectchProductsRequest(key, categoryGroup, category, status, page)
      );
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(memo(ProductsPage));
