import * as Types from "../constants/ProductOptionActTypes";
import { callApiToken, callApi } from "../utils/apiCaller";
import { useAlert, showAlertWithTimeout } from "./alertActions";

export const fectchColorOptionsRequest = (_id) => {
  return (dispatch) => {
    dispatch({ type: Types.COLOR_OPTIONS_REQUEST });
    callApi(`color-options/product/${_id}`, "GET", null).then((response) => {
      const type =
        response.status === 0
          ? Types.COLOR_OPTIONS_SUCCESS
          : Types.COLOR_OPTIONS_FAIL;
      dispatch({ type, payload: response });
    });
  };
};

export const createDataColorOptionRequest = (data) => {
  return (dispatch) => {
    callApiToken(dispatch, "color-options", "POST", data).then((response) => {
      const type =
        response.status === 0
          ? Types.COLOR_OPTION_CREATE_SUCCESS
          : Types.COLOR_OPTION_CREATE_FAIL;
      dispatch({ type, payload: response });
      dispatch(
        useAlert("Thêm màu sắc", response.message, response.status === 0)
      );
    });
  };
};

export const createColorOptionRequest = (file, data) => {
  return (dispatch) => {
    dispatch({ type: Types.COLOR_OPTION_CREATE_REQUEST });
    const formData = new FormData();
    formData.append("image", file);
    callApiToken(dispatch, "upload-image", "POST", formData).then(
      (response) => {
        if (response.status === 0) {
          data.image = response.data.url;
          dispatch(createDataColorOptionRequest(data));
        } else {
          const type = Types.COLOR_OPTION_CREATE_FAIL;
          dispatch({ type, payload: response });
          dispatch(
            showAlertWithTimeout(
              "Thêm màu sắc thất bại",
              response.message,
              false
            )
          );
        }
      }
    );
  };
};

export const updateDataColorOptionRequest = (data) => {
  return (dispatch) => {
    callApiToken(dispatch, "color-options", "PUT", data).then((response) => {
      let type = null;
      if (response.status === 0) {
        type = Types.COLOR_OPTION_UPDATE_SUCCESS;
        response.data = data;
      } else type = Types.COLOR_OPTION_UPDATE_FAIL;
      dispatch({ type, payload: response });
      dispatch(
        useAlert("Chỉnh sửa màu sắc", response.message, response.status === 0)
      );
    });
  };
};

export const updateColorOptionRequest = (file, data) => {
  return (dispatch) => {
    dispatch({ type: Types.COLOR_OPTION_UPDATE_REQUEST });
    if (file) {
      const formData = new FormData();
      formData.append("image", file);
      callApiToken(dispatch, "upload-image", "POST", formData).then(
        (response) => {
          if (response.status === 0) {
            data.image = response.data.url;
            dispatch(updateDataColorOptionRequest(data));
          } else {
            const type = Types.COLOR_OPTION_UPDATE_FAIL;
            dispatch({ type, payload: response });
            dispatch(
              showAlertWithTimeout(
                "Chỉnh sửa màu sắc thất bại",
                response.message,
                false
              )
            );
          }
        }
      );
    } else dispatch(updateDataColorOptionRequest(data));
  };
};

export const fectchSizeOptionsRequest = (_id) => {
  return (dispatch) => {
    dispatch({ type: Types.SIZE_OPTIONS_REQUEST });
    callApi(`size-options/product/${_id}`, "GET", null).then((response) => {
      const type =
        response.status === 0
          ? Types.SIZE_OPTIONS_SUCCESS
          : Types.SIZE_OPTIONS_FAIL;
      dispatch({ type, payload: response });
    });
  };
};

export const createSizeOptionRequest = (data) => {
  return (dispatch) => {
    dispatch({ type: Types.SIZE_OPTION_CREATE_REQUEST });
    callApiToken(dispatch, "size-options", "POST", data).then((response) => {
      const type =
        response.status === 0
          ? Types.SIZE_OPTION_CREATE_SUCCESS
          : Types.SIZE_OPTION_CREATE_FAIL;
      dispatch({ type, payload: response });
      dispatch(
        useAlert("Thêm kích thước", response.message, response.status === 0)
      );
    });
  };
};

export const updateSizeOptionRequest = (data) => {
  return (dispatch) => {
    dispatch({ type: Types.SIZE_OPTION_UPDATE_REQUEST });
    callApiToken(dispatch, "size-options", "PUT", data).then((response) => {
      let type = null;
      if (response.status === 0) {
        type = Types.SIZE_OPTION_UPDATE_SUCCESS;
        response.data = data;
      } else type = Types.SIZE_OPTION_UPDATE_FAIL;
      dispatch({ type, payload: response });
      dispatch(
        useAlert(
          "Chỉnh sửa kích thước",
          response.message,
          response.status === 0
        )
      );
    });
  };
};

export const fectchQuantityOptionsRequest = (_id) => {
  return (dispatch) => {
    dispatch({ type: Types.QUANTITY_OPTIONS_REQUEST });
    callApi(`quantity-options/productId=${_id}`, "GET", null).then(
      (response) => {
        const type =
          response.status === 0
            ? Types.QUANTITY_OPTIONS_SUCCESS
            : Types.QUANTITY_OPTIONS_FAIL;
        dispatch({ type, payload: response });
      }
    );
  };
};

export const adminFectchQuantityOptionsRequest = (_id) => {
  return (dispatch) => {
    dispatch({ type: Types.QUANTITY_OPTIONS_REQUEST });
    callApi(`quantity-options/admin/productId=${_id}`, "GET", null).then(
      (response) => {
        const type =
          response.status === 0
            ? Types.QUANTITY_OPTIONS_SUCCESS
            : Types.QUANTITY_OPTIONS_FAIL;
        dispatch({ type, payload: response });
      }
    );
  };
};

export const createQuantityOptionRequest = (data) => {
  return (dispatch) => {
    dispatch({ type: Types.QUANTITY_OPTION_CREATE_REQUEST });
    callApiToken(dispatch, "quantity-options", "POST", data).then(
      (response) => {
        const type =
          response.status === 0
            ? Types.QUANTITY_OPTION_CREATE_SUCCESS
            : Types.QUANTITY_OPTION_CREATE_FAIL;
        dispatch({ type, payload: response });
        dispatch(
          useAlert("Thêm số lượng", response.message, response.status === 0)
        );
      }
    );
  };
};

export const updateQuantityOptionRequest = (data) => {
  return (dispatch) => {
    dispatch({ type: Types.QUANTITY_OPTION_UPDATE_REQUEST });
    callApiToken(dispatch, "quantity-options", "PUT", data).then((response) => {
      let type = null;
      if (response.status === 0) {
        type = Types.QUANTITY_OPTION_UPDATE_SUCCESS;
        response.data = data;
      } else type = Types.QUANTITY_OPTION_UPDATE_FAIL;
      dispatch({ type, payload: response });
      dispatch(
        useAlert("Chỉnh sửa số lượng", response.message, response.status === 0)
      );
    });
  };
};
///
