import * as Types from "../constants/CategoryGroupActTypes";
import { callApiToken, callApi } from "../utils/apiCaller";
import { useAlert } from "./alertActions";

export const fectchCategoryGroupsRequest = (status = "all") => {
  return (dispatch) => {
    dispatch({ type: Types.CATEGORY_GROUPS_REQUEST });
    callApi(`category-groups/${status}`, "GET", null).then((response) => {
      const type =
        response.status === 0
          ? Types.CATEGORY_GROUPS_SUCCESS
          : Types.CATEGORY_GROUPS_FAIL;
      dispatch({ type, payload: response });
    });
  };
};

export const fectchCategoryGroupsWithCategoryRequest = (status = "all") => {
  return (dispatch) => {
    dispatch({ type: Types.CATEGORY_GROUPS_WITH_CATEGORY_REQUEST });
    callApi(`category-groups/with-category/${status}`, "GET", null).then(
      (response) => {
        const type =
          response.status === 0
            ? Types.CATEGORY_GROUPS_WITH_CATEGORY_SUCCESS
            : Types.CATEGORY_GROUPS_WITH_CATEGORY_FAIL;
        dispatch({ type, payload: response });
      }
    );
  };
};

export const createCategoryGroupRequest = (data) => {
  return (dispatch) => {
    dispatch({ type: Types.CATEGORY_GROUP_CREATE_REQUEST });
    callApiToken(dispatch, "category-groups", "POST", data).then((response) => {
      const type =
        response.status === 0
          ? Types.CATEGORY_GROUP_CREATE_SUCCESS
          : Types.CATEGORY_GROUP_CREATE_FAIL;
      dispatch({ type, payload: response });
      dispatch(
        useAlert("Thêm nhóm loại", response.message, response.status === 0)
      );
    });
  };
};

export const updateCategoryGroupRequest = (data) => {
  return (dispatch) => {
    dispatch({ type: Types.CATEGORY_GROUP_UPDATE_REQUEST });
    callApiToken(dispatch, "category-groups", "PUT", data).then((response) => {
      let type = null;
      if (response.status === 0) {
        type = Types.CATEGORY_GROUP_UPDATE_SUCCESS;
        response.data = data;
      } else type = Types.CATEGORY_GROUP_UPDATE_FAIL;
      dispatch({ type, payload: response });
      dispatch(
        useAlert("Cập nhật nhóm loại", response.message, response.status === 0)
      );
    });
  };
};
