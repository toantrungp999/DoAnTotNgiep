import * as Types from "../constants/ProductsActTypes";
import { callApiToken, callApi } from "../utils/apiCaller";
import { useAlert, showAlertWithTimeout } from "./alertActions";

export const fectchProductHomepagesRequest = () => {
  return (dispatch) => {
    dispatch({ type: Types.PRODUCT_HOMEPAGE_REQUEST });
    callApi(`products/homepage`, "GET", null).then((response) => {
      const type =
        response.status === 0
          ? Types.PRODUCT_HOMEPAGE_SUCCESS
          : Types.PRODUCT_HOMEPAGE_FAIL;
      dispatch({ type, payload: response });
    });
  };
};

export const fectchRecommendedProductsRequest = (userId, productId) => {
  return (dispatch) => {
    dispatch({ type: Types.RECOMMENDED_PRODUCT_REQUEST });
    callApi(
      `products/recommended/userId=${userId}&productId=${productId}`,
      "GET",
      null
    ).then((response) => {
      const type =
        response.status === 0
          ? Types.RECOMMENDED_PRODUCT_SUCCESS
          : Types.RECOMMENDED_PRODUCT_FAIL;
      dispatch({ type, payload: response });
    });
  };
};
// export const fectchProductsRequest = (path,min,max, page, status = 'all') => {
//   return (dispatch) => {
//     dispatch({ type: Types.PRODUCTS_REQUEST });
//     callApi(`products/special/path=${path}&min=${min}&max=${max}&page=${page}&status=${status}`, 'GET', null).then(response => {
//       const type = response.status === 0 ? Types.PRODUCTS_SUCCESS : Types.PRODUCTS_FAIL;
//       dispatch({ type, payload: response });
//     });
//   };
// }

export const fectchProductsRequest = (
  path,
  key,
  min,
  max,
  option,
  page,
  status = "all"
) => {
  return (dispatch) => {
    dispatch({ type: Types.PRODUCTS_REQUEST });
    callApi(
      `products/path=${path}&key=${key}&min=${min}&max=${max}&option=${option}&page=${page}&status=${status}`,
      "GET",
      null
    ).then((response) => {
      const type =
        response.status === 0 ? Types.PRODUCTS_SUCCESS : Types.PRODUCTS_FAIL;
      dispatch({ type, payload: response });
    });
  };
};

export const searchProductsRequest = (keyword) => {
  return (dispatch) => {
    dispatch({ type: Types.PRODUCTS_SEARCH_REQUEST, payload: keyword });
    callApi(`products/search/key=${keyword}`, "GET", null).then((response) => {
      const type =
        response.status === 0
          ? Types.PRODUCTS_SEARCH_SUCCESS
          : Types.PRODUCTS_SEARCH_FAIL;
      dispatch({ type, payload: response });
    });
  };
};

export const adminFectchProductsRequest = (
  search,
  category,
  status = "all",
  page
) => {
  return (dispatch) => {
    dispatch({ type: Types.PRODUCTS_REQUEST });
    callApi(
      `products/admin?search=${search}&category=${category}&status=${status}&page=${page}`,
      "GET",
      null
    ).then((response) => {
      const type =
        response.status === 0 ? Types.PRODUCTS_SUCCESS : Types.PRODUCTS_FAIL;
      dispatch({ type, payload: response });
    });
  };
};

export const insertDataProductRequest = (data) => {
  return (dispatch) => {
    callApiToken(dispatch, "products", "POST", data).then((response) => {
      const type =
        response.status === 0
          ? Types.PRODUCT_CREATE_SUCCESS
          : Types.PRODUCT_CREATE_FAIL;
      dispatch({ type, payload: response });
      dispatch(
        useAlert("Thêm sản phẩm", response.message, response.status === 0)
      );
    });
  };
};

export const createProductRequest = (files, data) => {
  return (dispatch) => {
    dispatch({ type: Types.PRODUCT_CREATE_REQUEST });
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) formData.append("image", files[i]);
    callApiToken(dispatch, "upload-images", "POST", formData).then(
      (response) => {
        if (response.status === 0) {
          let length = response.data.data.length;
          var images = [];
          for (let i = 0; i < length; i++)
            images.push(response.data.data[i].url);
          data.images = images;
          dispatch(insertDataProductRequest(data));
        } else {
          dispatch({ type: Types.PRODUCT_CREATE_FAIL, payload: response });
          dispatch(
            showAlertWithTimeout(
              "Thêm sản phẩm thất bại",
              response.message,
              false
            )
          );
        }
      }
    );
  };
};

export const adminFectchProductRequest = (_id) => {
  return (dispatch) => {
    dispatch({ type: Types.PRODUCT_DETAIL_REQUEST });
    callApi(`products/admin/${_id}`, "GET", null).then((response) => {
      const type =
        response.status === 0
          ? Types.PRODUCT_DETAIL_SUCCESS
          : Types.PRODUCT_DETAIL_FAIL;
      dispatch({ type, payload: response });
    });
  };
};

export const fectchProductRequest = (id) => {
  return (dispatch) => {
    dispatch({ type: Types.PRODUCT_DETAIL_REQUEST });
    callApi(`products/${id}`, "GET", null).then((response) => {
      const type =
        response.status === 0
          ? Types.PRODUCT_DETAIL_SUCCESS
          : Types.PRODUCT_DETAIL_FAIL;
      dispatch({ type, payload: response });
    });
  };
};

export const updateDataProductRequest = (data) => {
  return (dispatch) => {
    callApiToken(dispatch, "products", "PUT", data).then((response) => {
      let type = null;
      if (response.status === 0) {
        response.data = data;
        type = Types.PRODUCT_UPDATE_SUCCESS;
      } else type = Types.PRODUCT_UPDATE_FAIL;
      dispatch({ type, payload: response });
      dispatch(
        useAlert("Cập nhật sản phẩm", response.message, response.status === 0)
      );
    });
  };
};

export const updateProductRequest = (files, data) => {
  return (dispatch) => {
    dispatch({ type: Types.PRODUCT_UPDATE_REQUEST });
    if (files) {
      const formData = new FormData();
      for (let i = 0; i < files.length; i++) formData.append("image", files[i]);
      callApiToken(dispatch, "upload-images", "POST", formData).then(
        (response) => {
          if (response.status === 0) {
            let length = response.data.data.length;
            var images = [];
            for (let i = 0; i < length; i++)
              images.push(response.data.data[i].url);
            data.images = images;
            dispatch(updateDataProductRequest(data));
          } else {
            dispatch({ type: Types.PRODUCT_UPDATE_FAIL, payload: response });
            dispatch(
              showAlertWithTimeout(
                "Cập nhật sản phẩm thất bại",
                response.message,
                false
              )
            );
          }
        }
      );
    } else dispatch(updateDataProductRequest(data));
  };
};
