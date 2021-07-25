import * as Types from "../constants/UsersActTypes";
import { callApiToken } from "../utils/apiCaller";
import { useAlert } from "./alertActions";

export const fectchUsersRequest = (page = 1) => {
  return (dispatch) => {
    dispatch({ type: Types.USERS_REQUEST });
    callApiToken(dispatch, `users/page=${page}`, "GET", null).then(
      (response) => {
        const type =
          response.status === 0 ? Types.USERS_SUCCESS : Types.USERS_FAIL;
        dispatch({ type, payload: response });
      }
    );
  };
};

export const fectchAllUsersRequest = () => {
  return (dispatch) => {
    dispatch({ type: Types.USERS_GET_ALL_REQUEST });
    callApiToken(dispatch, "users/getall", "GET", null).then((response) => {
      const type =
        response.status === 0
          ? Types.USERS_GET_ALL_SUCCESS
          : Types.USERS_GET_ALL_FAIL;
      dispatch({ type, payload: response });
    });
  };
};

export const searchUsersRequest = (
  keyword,
  page = 1,
  pageSize,
  isSearch = false
) => {
  return (dispatch) => {
    if (isSearch) dispatch({ type: Types.USERS_REQUEST });
    else dispatch({ type: Types.USERS_SEARCH_REQUEST, payload: { keyword } });
    callApiToken(
      dispatch,
      `users/searchString=${keyword}&page=${page}&pagesize=${pageSize}`,
      "GET",
      null
    ).then((response) => {
      let type = null;
      if (isSearch)
        type = response.status === 0 ? Types.USERS_SUCCESS : Types.USERS_FAIL;
      else {
        if (response.status === 0) {
          response.data.keyword = keyword;
          type = Types.USERS_SEARCH_SUCCESS;
        } else type = Types.USERS_SEARCH_FAIL;
      }
      dispatch({ type, payload: response });
    });
  };
};

export const fectchDetailUserRequest = (_id) => {
  return (dispatch) => {
    dispatch({ type: Types.USER_DETAIL_REQUEST });
    callApiToken(dispatch, `users/${_id}`, "GET", null).then((response) => {
      const type =
        response.status === 0
          ? Types.USER_DETAIL_SUCCESS
          : Types.USER_DETAIL_FAIL;
      dispatch({ type, payload: response });
    });
  };
};

export const updateStatusRoleRequest = (data) => {
  return (dispatch) => {
    dispatch({ type: Types.USER_UPDATE_REQUEST });
    callApiToken(dispatch, "users", "PUT", data).then((response) => {
      let type = null;
      if (response.status === 0) {
        type = Types.USER_UPDATE_SUCCESS;
        response.data = data;
      } else type = Types.USER_DETAIL_FAIL;
      dispatch({ type, payload: response });
      dispatch(
        useAlert(
          "Cập nhật quyền người dùng",
          response.message,
          response.status === 0
        )
      );
    });
  };
};
