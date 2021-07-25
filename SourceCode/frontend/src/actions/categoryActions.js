import * as Types from "../constants/CategoryActTypes";
import { callApiToken, callApi } from "../utils/apiCaller";
import { useAlert } from "./alertActions";

export const fectchCategoriesRequest = (status = "all") => {
  return (dispatch) => {
    dispatch({ type: Types.CATEGORIES_REQUEST });
    callApi(`categories/${status}`, "GET", null).then((response) => {
      const type =
        response.status === 0
          ? Types.CATEGORIES_SUCCESS
          : Types.CATEGORIES_FAIL;
      dispatch({ type, payload: response });
    });
  };
};

export const createCategoryRequest = (data) => {
  return (dispatch) => {
    dispatch({ type: Types.CATEGORY_CREATE_REQUEST });
    callApiToken(dispatch, "categories", "POST", data).then((response) => {
      const type =
        response.status === 0
          ? Types.CATEGORY_CREATE_SUCCESS
          : Types.CATEGORY_CREATE_FAIL;
      dispatch({ type, payload: response });
      dispatch(
        useAlert("Thêm loại sản phẩm", response.message, response.status === 0)
      );
    });
  };
};

export const updateCategoryRequest = (data) => {
  return (dispatch) => {
    dispatch({ type: Types.CATEGORY_UPDATE_REQUEST });
    callApiToken(dispatch, "categories", "PUT", data).then((response) => {
      let type = null;
      if (response.status === 0) {
        type = Types.CATEGORY_UPDATE_SUCCESS;
        response.data = data;
      } else type = Types.CATEGORY_UPDATE_FAIL;
      dispatch({ type, payload: response });
      dispatch(
        useAlert(
          "Cập nhật loại sản phẩm",
          response.message,
          response.status === 0
        )
      );
    });
  };
};
