import * as Types from "../constants/CartActTypes";
import { callApiToken } from '../utils/apiCaller';

export const fectchCartsRequest = () => {
    return (dispatch) => {
        dispatch({ type: Types.CARTS_REQUEST });
        callApiToken(dispatch, 'carts', 'GET', null).then(response => {
            const type = response.status === 0 ? Types.CARTS_SUCCESS : Types.CARTS_FAIL;
            dispatch({ type, payload: response });
        });
    };
}

export const reFectchCartsRequest = () => {
    return (dispatch) => {
        callApiToken(dispatch, 'carts', 'GET', null).then(response => {
            const type = response.status === 0 ? Types.RE_CARTS_SUCCESS : Types.RE_CARTS_FAIL;
            dispatch({ type, payload: response });
        });
    };
}

export const createCartRequest = (data) => {
    return (dispatch) => {
        dispatch({ type: Types.CART_CREATE_REQUEST });
        callApiToken(dispatch, 'carts', 'POST', data).then(response => {
            const type = response.status === 0 ? Types.CART_CREATE_SUCCESS : Types.CART_CREATE_FAIL;
            dispatch({ type, payload: response });
        });
    };
}

export const updateCartRequest = (data) => {
    return (dispatch) => {
        dispatch({ type: Types.CART_UPDATE_REQUEST });
        callApiToken(dispatch, 'carts', 'PUT', data).then(response => {
            let type = null;
            if (response.status !== 0) {
                type = Types.CART_UPDATE_SUCCESS;
                response.data = data;
            }
            else {
                type = Types.CART_UPDATE_FAIL;
                dispatch(reFectchCartsRequest());
            }
            dispatch({ type, payload: response });
        });
    };
}

export const updateTypeCartRequest = (data) => {
    return (dispatch) => {
        dispatch({ type: Types.CART_UPDATE_TYPE_REQUEST });
        callApiToken(dispatch, 'carts/update-type', 'PUT', data).then(response => {
            let type = null;
            if (response.status === 0) {
                type = Types.CART_UPDATE_TYPE_SUCCESS;
                response.data = { cart: response.data, cartId: data.cartId };
            }
            else
                type = Types.CART_UPDATE_TYPE_FAIL;
            dispatch({ type, payload: response });
        });
    };
}

export const deleteCartRequest = (data) => {
    return (dispatch) => {
        dispatch({ type: Types.CART_DELETE_REQUEST });
        callApiToken(dispatch, `carts/${data}`, 'DELETE', null).then(response => {
            let type = null;
            if (response.status === 0) {
                type = Types.CART_DELETE_SUCCESS;
                response.data = data;
            }
            else
                type = Types.CART_DELETE_FAIL;
            dispatch({ type, payload: response });
        });
    };
}

export const clearStateCart = () => {
    return (dispatch) => {
        dispatch({ type: Types.CART_CLEAR_STATE });
    }
}