import * as Types from "../constants/BrandActTypes";
import { callApiToken, callApi } from "../utils/apiCaller";
import { useAlert } from "./alertActions";

export const fectchBrandsRequest = (status = "all") => {
  return (dispatch) => {
    dispatch({ type: Types.BRANDS_REQUEST });
    callApi(`brands/${status}`, "GET", null).then((response) => {
      const type =
        response.status === 0 ? Types.BRANDS_SUCCESS : Types.BRANDS_FAIL;
      dispatch({ type, payload: response });
    });
  };
};

export const CreateBrandRequest = (data) => {
  return (dispatch) => {
    dispatch({ type: Types.BRAND_CREATE_REQUEST });
    callApiToken(dispatch, "brands", "POST", data).then((response) => {
      const type =
        response.status === 0
          ? Types.BRAND_CREATE_SUCCESS
          : Types.BRAND_CREATE_FAIL;
      dispatch({ type, payload: response });
      //dispatch(useAlert('Thêm hãng', response.message, response.status === 0));
    });
  };
};

export const updateBrandRequest = (data) => {
  return (dispatch) => {
    dispatch({ type: Types.BRAND_UPDATE_REQUEST });
    callApiToken(dispatch, "brands", "PUT", data).then((response) => {
      let type = null;
      if (response.status === 0) {
        type = Types.BRAND_UPDATE_SUCCESS;
        response.data = data;
      } else type = Types.BRAND_UPDATE_FAIL;
      dispatch({ type, payload: response });
      dispatch(
        useAlert(
          "Cập nhật thông tin hãng",
          response.message,
          response.status === 0
        )
      );
    });
  };
};
