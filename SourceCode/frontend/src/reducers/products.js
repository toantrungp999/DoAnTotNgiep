import * as Types from "../constants/ProductsActTypes";

function productsReducer(state = {}, action) {
  switch (action.type) {
    case Types.PRODUCTS_REQUEST:
      return { loading: true };
    case Types.PRODUCTS_SUCCESS:
      return {
        loading: false,
        products: action.payload.data.products,
        colorOptions: action.payload.data.colorOptions,
        sizeOptions: action.payload.data.sizeOptions,
        pagingInfo: action.payload.data.pagingInfo,
        searchInfo: action.payload.data.searchInfo,
      };
    case Types.PRODUCTS_FAIL:
      return { loading: false, message: action.payload.message };

    default:
      return state;
  }
}

function productCreateReducer(state = {}, action) {
  switch (action.type) {
    case Types.PRODUCT_CREATE_REQUEST:
      return { loading: true };
    case Types.PRODUCT_CREATE_SUCCESS:
      return { loading: false };
    case Types.PRODUCT_CREATE_FAIL:
      return {
        loading: false,
        success: false,
        message: action.payload.message,
      };
    default:
      return state;
  }
}

function productDetailReducer(state = { loading: true }, action) {
  switch (action.type) {
    case Types.PRODUCT_DETAIL_REQUEST:
      state.loading = true;
      state.message = "";
      return { ...state };
    case Types.PRODUCT_UPDATE_REQUEST:
      state.message = null;
      state.success = null;
      state.loading = false;
      return { ...state };
    case Types.PRODUCT_DETAIL_SUCCESS:
      return { loading: false, product: action.payload.data };
    case Types.PRODUCT_UPDATE_SUCCESS:
      state.product = action.payload.data;
      state.loading = false;
      state.success = true;
      return { ...state };
    case Types.PRODUCT_UPDATE_FAIL || Types.PRODUCT_DETAIL_FAIL:
      state.loading = false;
      state.message = action.payload.message;
      state.success = false;
      return { ...state };
    default:
      return state;
  }
}

function productHomepagesReducer(state = { loading: true }, action) {
  switch (action.type) {
    case Types.PRODUCT_HOMEPAGE_REQUEST:
      return { loading: true };
    case Types.PRODUCT_HOMEPAGE_SUCCESS:
      return { loading: false, productHomepages: action.payload.data };
    case Types.PRODUCT_HOMEPAGE_FAIL:
      state.loading = false;
      state.message = action.payload.message;
      return { ...state };
    default:
      return state;
  }
}

function searchProductsReducer(state = { loading: true }, action) {
  switch (action.type) {
    case Types.PRODUCTS_SEARCH_REQUEST:
      state.key = action.payload;
      // state.loading = true;
      // state.searchProducts = null;
      // state.keyword = action.payload.keyword;
      return { ...state };
    case Types.PRODUCTS_SEARCH_SUCCESS:
      state.loading = false;
      state.searchProducts = action.payload.data.products;
      return { ...state };
    case Types.PRODUCTS_SEARCH_FAIL:
      state.loading = false;
      state.searchProducts = null;
      return { ...state };
    default:
      return state;
  }
}

function recommendedProductsReducer(state = { loading: true }, action) {
  switch (action.type) {
    case Types.RECOMMENDED_PRODUCT_REQUEST:
      return { loading: true };
    case Types.RECOMMENDED_PRODUCT_SUCCESS:
      return {
        loading: false,
        recommendedProducts: action.payload.data.recommendedProducts,
        sizeOptions: action.payload.data.sizeOptions,
        colorOptions: action.payload.data.colorOptions,
      };
    case Types.RECOMMENDED_PRODUCT_FAIL:
      return {
        loading: false,
        message: action.payload.message,
      };
    default:
      return state;
  }
}

export {
  productsReducer,
  productCreateReducer,
  productDetailReducer,
  productHomepagesReducer,
  searchProductsReducer,
  recommendedProductsReducer,
};
