import * as Types from "../constants/ProductsActTypes";
import { callApi } from '../utils/apiCaller';

export const fectchProductHomepagesRequest = () => {
  return (dispatch) => {
    dispatch({ type: Types.PRODUCT_HOMEPAGE_REQUEST });
    callApi(`products/homepage`, 'GET', null).then(response => {
      const type = response.status === 0 ? Types.PRODUCT_HOMEPAGE_SUCCESS : Types.PRODUCT_HOMEPAGE_FAIL;
      dispatch({ type, payload: response });
    });
  };
}

export const fectchRecommendedProductsRequest = (userId,productId) => {
  return (dispatch) => {
    dispatch({ type: Types.RECOMMENDED_PRODUCT_REQUEST });
    callApi(`products/recommended/userId=${userId}&productId=${productId}`, 'GET', null).then(response => {
      const type = response.status === 0 ? Types.RECOMMENDED_PRODUCT_SUCCESS : Types.RECOMMENDED_PRODUCT_FAIL;
      dispatch({ type, payload: response });
    });
  };
}

export const fectchProductsRequest = (path, key, min, max, option, page, status = 'all') => {
  return (dispatch) => {
    dispatch({ type: Number(page)>1?Types.PRODUCTS_VIEW_MORE_REQUEST:Types.PRODUCTS_REQUEST });
    callApi(`products/path=${path}&key=${key}&min=${min}&max=${max}&option=${option}&page=${page}&status=${status}`, 'GET', null).then(response => {
      const type = response.status === 0 ? Types.PRODUCTS_SUCCESS : Types.PRODUCTS_FAIL;
      dispatch({ type, payload: response });
    });
  };
}

export const searchProductsRequest = (keyword, page, pageSize, isSearch = false, option = 0, status = 'all') => {
  return (dispatch) => {
    if (isSearch)
      dispatch({ type: page > 1 ? Types.PRODUCTS_VIEW_MORE_REQUEST : Types.PRODUCTS_REQUEST });
    else
      dispatch({ type: Types.PRODUCTS_SEARCH_REQUEST, payload: { keyword } });
    callApi(`products/searchString=${keyword}&page=${page}&pagesize=${pageSize}&option=${option}&status=${status}`, 'GET', null).then(response => {
      let type = null;
      if (isSearch)
        type = response.status === 0 ? Types.PRODUCTS_SUCCESS : Types.PRODUCTS_FAIL;
      else {
        if (response.status === 0) {
          response.data.keyword = keyword;
          type = Types.PRODUCTS_SEARCH_SUCCESS
        }
        else type = Types.PRODUCTS_SEARCH_FAIL;
      }
      dispatch({ type, payload: response });
    });
  };
}

export const fectchProductRequest = (_id) => {
  return (dispatch) => {
    dispatch({ type: Types.PRODUCT_DETAIL_REQUEST });
    callApi(`products/${_id}`, 'GET', null).then(response => {
      const type = response.status === 0 ? Types.PRODUCT_DETAIL_SUCCESS : Types.PRODUCT_DETAIL_FAIL;
      dispatch({ type, payload: response });
    });
  };
}