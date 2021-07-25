import axios from "axios";
import Cookie from "js-cookie";
import * as Config from "../constants/Config";
import * as Message from "../constants/Message";
import * as ResponeseStatus from "../constants/ResponeseStatus";
import { logoutRequest } from "../actions/userActions";

function callApi(endpoint, metthod = "GET", body, accessToken = null) {
  return axios({
    method: metthod,
    url: `${Config.API_URL}/${endpoint}`,
    data: body,
    headers: { "x-access-token": accessToken },
  })
    .then((res) => {
      let response = res.data;
      if (response.status === ResponeseStatus.INPUT_DATA) {
        if (response.message.includes("length must be less than or equal to"))
          response.message = response.message
            .replace(
              "length must be less than or equal to",
              Message.CHECK_LENGTH_MAX_VN
            )
            .replace("characters long", Message.CHARACTER_VN);
        if (response.message.includes("length must be at least"))
          response.message = response.message
            .replace("length must be at least", Message.CHECK_LENGTH_MIN_VN)
            .replace("characters long", Message.CHARACTER_VN);
      }
      return response;
    })
    .catch((error) => {
      let status = 404;
      let message = null;
      if (!error.response) {
        message = Message.DISCONNECT_VN;
      } else {
        message = error.response.data;
        if (error.response.status) status = error.response.status;
      }
      return { status, data: null, message };
    });
}

function callApiToken(dispatch, endpoint, method = "GET", body = null) {
  const accessToken = Cookie.getJSON("x-access-token") || null;
  const refreshToken = Cookie.getJSON("refreshToken") || null;
  if (!accessToken) {
    if (!refreshToken) {
      dispatch(logoutRequest());
      return {
        status: ResponeseStatus.NO_TOKEN,
        data: null,
        message: "Token not found!",
      };
    } else {
      return callApiRefreshToken(refreshToken)
        .then((response) => {
          if (!response.accessToken)
            return (dispatch) => {
              dispatch(logoutRequest());
              return {
                status: ResponeseStatus.REFRESH_TOKEN_FAIL,
                data: null,
                message: "Refresh token fail!",
              };
            };
          return callApi(endpoint, method, body, response.accessToken);
        })
        .catch((error) => {
          dispatch(logoutRequest());
          return {
            status: ResponeseStatus.REFRESH_TOKEN_FAIL,
            data: null,
            message: "Refresh token fail!",
          };
        });
    }
  } else
    return callApi(endpoint, method, body, accessToken).then((response) => {
      if (response.status === ResponeseStatus.TOKEN_EXPIRED) {
        return callApiRefreshToken(refreshToken)
          .then((response) => {
            if (!response.accessToken) {
              dispatch(logoutRequest());
              return {
                status: ResponeseStatus.REFRESH_TOKEN_FAIL,
                data: null,
                message: "Refresh token fail!",
              };
            }
            return callApi(endpoint, method, body, response.accessToken);
          })
          .catch(() => {
            dispatch(logoutRequest());
            return {
              status: ResponeseStatus.REFRESH_TOKEN_FAIL,
              data: null,
              message: "Refresh token fail!",
            };
          });
      } else if (
        response.status === ResponeseStatus.NO_PROVIDED_TOKEN ||
        response.status === ResponeseStatus.INVALID_TOKEN
      ) {
        dispatch(logoutRequest());
        return {
          status: ResponeseStatus.NO_TOKEN,
          data: null,
          message: "Invalid Token!",
        };
      } else return response;
    });
}

function callApiRefreshToken(refreshToken) {
  return axios({
    method: "GET",
    url: `${Config.API_URL}/refreshToken`,
    headers: { refreshToken: refreshToken },
  })
    .then((res) => {
      const response = res.data;
      if (response.status === 0) {
        const { accessToken } = response.data;
        Cookie.set("x-access-token", JSON.stringify(accessToken), {
          path: "/",
          expires: new Date(Date.now() + 36000000),
        });
        return { accessToken };
      }
      return null;
    })
    .catch(() => {
      return null;
    });
}

export { callApi, callApiToken, callApiRefreshToken };
