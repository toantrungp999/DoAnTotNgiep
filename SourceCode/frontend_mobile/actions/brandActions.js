import * as Types from "../constants/BrandActTypes";
import { callApi } from '../utils/apiCaller';

export const fectchBrandsRequest = (status = 'all') => {
  return (dispatch) => {
    dispatch({ type: Types.BRANDS_REQUEST });
    callApi(`brands/${status}`, 'GET', null).then(response => {
      const type = response.status === 0 ? Types.BRANDS_SUCCESS : Types.BRANDS_FAIL;
      dispatch({ type, payload: response });
    });
  };
}

export const fectchBrandRequest = (_id) => {
    return (dispatch) => {
      dispatch({ type: Types.BRAND_REQUEST });
      callApi(`brands/detail/${_id}`, 'GET', null).then(response => {
        const type = response.status === 0 ? Types.BRAND_SUCCESS : Types.BRAND_FAIL;
        dispatch({ type, payload: response });
      });
    };
  }