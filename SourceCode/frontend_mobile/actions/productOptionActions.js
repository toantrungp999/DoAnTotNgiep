import * as Types from "../constants/ProductOptionActTypes";
import { callApi } from '../utils/apiCaller';

export const fectchColorOptionsRequest = (_id) => {
  return (dispatch) => {
    dispatch({ type: Types.COLOR_OPTIONS_REQUEST });
    callApi(`color-options/product/${_id}`, 'GET', null).then(response => {
      const type = response.status === 0 ? Types.COLOR_OPTIONS_SUCCESS : Types.COLOR_OPTIONS_FAIL;
      dispatch({ type, payload: response });
    });
  };
}


export const fectchSizeOptionsRequest = (_id) => {
  return (dispatch) => {
    dispatch({ type: Types.SIZE_OPTIONS_REQUEST });
    callApi(`size-options/product/${_id}`, 'GET', null).then(response => {
      const type = response.status === 0 ? Types.SIZE_OPTIONS_SUCCESS : Types.SIZE_OPTIONS_FAIL;
      dispatch({ type, payload: response });
    });
  };
}


export const fectchQuantityOptionsRequest = (_id) => {
  return (dispatch) => {
    dispatch({ type: Types.QUANTITY_OPTIONS_REQUEST });
    callApi(`quantity-options/productId=${_id}`, 'GET', null).then(response => {
      const type = response.status === 0 ? Types.QUANTITY_OPTIONS_SUCCESS : Types.QUANTITY_OPTIONS_FAIL;
      dispatch({ type, payload: response });
    });
  };
}