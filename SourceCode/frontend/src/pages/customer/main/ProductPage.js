import React, { memo } from "react";
import { connect } from "react-redux";
import { fectchProductsRequest } from "../../../actions/productActions";
import ProductItem from "../../../components/customer/productIem/ProductItem";
import Paging from "../../../components/common/paging/Paging";
import PageTitle from "../../../components/customer/pageTitle/PageTitle";
import Loading from "../../../components/common/loading/Loading";
import queryString from "query-string";
import "./ProductPage.css";

class ProductPage extends React.Component {
  componentDidMount() {
    const path = this.props.location.pathname.replace("/", "");
    let { key, min, max, option, page } = queryString.parse(
      this.props.location.search
    );
    if (min === undefined || min === null) min = 0;
    if (!max) max = 2000000;
    if (!page) page = 1;
    if (!option) option = 1;
    // if (path === 'new-product' || path === 'hot-product' || path === 'best-seller')
    //     this.props.fectchProducts(path,min,max, page);
    // else
    this.props.fectchProducts(path, key, min, max, option, page);

    console.log(key);
  }

  componentDidUpdate(prevProps) {
    if (this.props.location !== prevProps.location) {
      const path = this.props.location.pathname.replace("/", "");
      let { key, min, max, option, page } = queryString.parse(
        this.props.location.search
      );
      if (min === undefined || min === null) min = 0;
      if (!max) max = 2000000;
      if (!page) page = 1;
      if (!option) option = 1;
      // if (path === 'new-product' || path === 'hot-product' || path === 'best-seller')
      //     this.props.fectchProducts(path, page);
      // else
      this.props.fectchProducts(path, key, min, max, option, page);
      console.log(key);
    }
  }

  onFetchData = (page) => {
    this.updateUrl(null, null, null, page);
  };

  onChangeSortOption = (e) => {
    this.updateUrl(null, null, e.target.value, 1);
  };

  onChangePriceRange = (range) => {
    this.updateUrl(range[0], range[1], null, 1);
  };
  //truyền null nếu không muốn thay đổi giá trị
  updateUrl = (newMin, newMax, newOption, newPage) => {
    const path = this.props.location.pathname.replace("/", "");
    let { key, min, max, option, page } = queryString.parse(
      this.props.location.search
    );
    min = newMin !== undefined && newMin !== null ? newMin : min;
    max = newMax ? newMax : max;
    option = newOption ? newOption : option;
    page = newPage ? newPage : page;
    let url = `/${path}?`;
    if (key) url += `key=${key}`;
    if (min !== undefined && min !== null && min.toString() !== "0")
      url += `&min=${min}`;
    if (max && max.toString() !== "2000000") url += `&max=${max}`;
    if (option) url += `&option=${option}`;
    if (page && page.toString() !== "1") url += `&page=${page}`;

    this.props.history.push(url);
  };

  render() {
    const {
      loading,
      products,
      pagingInfo,
      searchInfo,
      colorOptions,
      sizeOptions,
    } = this.props.productsReducer;

    if (loading) {
      return (
        <div className="product-page">
          <PageTitle
            location={this.props.location}
            searchInfo={searchInfo}
            onChangeSortOption={this.onChangeSortOption}
          />
          <div className="products">
            <Loading />
          </div>
        </div>
      );
    }
    let productElements =
      products && products.length > 0 ? (
        products.map((product, index) => {
          return (
            <ProductItem
              key={product._id}
              index={index}
              product={product}
              colorOptions={colorOptions}
              sizeOptions={sizeOptions}
            />
          );
        })
      ) : (
        <div className="no-data">Không tìm thấy sản phẩm</div>
      );
    return (
      <div className="product-page">
        <PageTitle
          location={this.props.location}
          searchInfo={searchInfo}
          onChangeSortOption={this.onChangeSortOption}
          onChangePriceRange={this.onChangePriceRange}
        />
        <div className="products">{productElements}</div>
        <Paging
          onFetchData={this.onFetchData}
          pagingInfo={pagingInfo}
          loading={loading}
          location={this.props.location}
        />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    productsReducer: state.productsReducer,
    // brandsReducer: state.brandsReducer,
    // categoriesReducer: state.categoriesReducer,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    // fectchProducts: (path,min,max, page) => {
    //     dispatch(fectchProductsRequest(path,min,max, page, 'true'));
    // },
    // searchProducts: (search, page, pageSize, isSearch, option) => {
    //     dispatch(searchProductsRequest(search, page, pageSize, isSearch, option, 'true'));
    // },
    fectchProducts: (path, key, min, max, option, page) => {
      dispatch(
        fectchProductsRequest(path, key, min, max, option, page, "true")
      );
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(memo(ProductPage));
