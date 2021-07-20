import * as Types from "../constants/OrdersActTypes";
import { callApiToken } from '../utils/apiCaller';
import {reFectchCartsRequest} from './cartActions';
import { useAlert, showAlertWithTimeout } from './alertActions';

export const clearState = () => {
    return ({ type: Types.CLEAR_STATE, payload: '' });
}

export const fetchProductRequest = (data) => {
    return (dispatch) => {
        dispatch({ type: Types.ORDER_FETCH_PRODUCT_REQUEST });
        callApiToken(dispatch, 'orders/create/fetchCart', 'POST', data).then(response => {
            const type = response.status === 0 ? Types.ORDER_FETCH_PRODUCT_SUCCESS : Types.ORDER_FETCH_PRODUCT_FAIL;
            dispatch({ type, payload: response });
        });
    };
}

export const createOrderRequest = (data,path) => {
    return (dispatch) => {
        dispatch({ type:Types.ORDER_CREATE_REQUEST });
        callApiToken(dispatch, `orders/${path}`, 'POST', data).then(response => {
            const type = response.status === 0 ? Types.ORDER_CREATE_SUCCESS : Types.ORDER_CREATE_FAIL;
            dispatch({ type, payload: response });
            dispatch(reFectchCartsRequest());
            dispatch(useAlert('Đặt hàng', response.message, response.status === 0));
        });
    };
}

export const fetchOrdersRequest = (all, status, search, page) => {
    return (dispatch) => {
        dispatch({ type: Number(page)>1?Types.ORDERS_VIEW_MORE_REQUEST:Types.ORDERS_REQUEST });
        callApiToken(dispatch, `orders${all}?status=${status}&search=${search}&page=${page}`, 'GET', null).then(response => {
            const type = response.status === 0 ? Types.ORDERS_SUCCESS : Types.ORDERS_FAIL;
            dispatch({ type, payload: response });
        });
    };
}

export const fetchOrderRequest = (_id, all) => {
    return (dispatch) => {
        dispatch({ type: Types.ORDER_REQUEST });
        callApiToken(dispatch, `orders${all}/${_id}`, 'GET', null).then(response => {
            const type = response.status === 0 ? Types.ORDER_SUCCESS : Types.ORDER_FAIL;
            dispatch({ type, payload: response });
        });
    };
}

export const orderChangeTypeRequest = (path,_id, data) => {
    return (dispatch) => {
        dispatch({ type: Types.ORDER_CHANGE_TYPE_REQUEST });
        callApiToken(dispatch, `orders/${path}/${_id}`, 'PUT', data).then(response => {
            const type = response.status === 0 ? Types.ORDER_CHANGE_TYPE_SUCCESS : Types.ORDER_CHANGE_TYPE_FAIL;
            dispatch({ type, payload: response });
            dispatch(useAlert('Thao tác', response.message, response.status === 0));
        });
    };
}

// export const orderApproveRequest = (_id, data) => {
//     return (dispatch) => {
//         dispatch({ type: Types.ORDER_CHANGE_TYPE_REQUEST });
//         callApiToken(dispatch, `orders/approve/${_id}`, 'PUT', data).then(response => {
//             const type = response.status === 0 ? Types.ORDER_APPROVE_FAIL : Types.ORDER_APPROVE_FAIL;
//             dispatch({ type, payload: response });
//         });
//     };
// }

export const ShippingFeeRequest = (address) => {
    return (dispatch) => {
        dispatch({ type: Types.SHIPPING_FEE_REQUEST });
        callApiToken(dispatch, `orders/shippingfee`, 'POST', address).then(response => {
            const type = response.status === 0 ? Types.SHIPPING_FEE_SUCCESS : Types.SHIPPING_FEE_FAIL;
            dispatch({ type, payload: response });
        });
    };
}

export const fetchStoreAddressesRequest = () => {
    return (dispatch) => {
        dispatch({ type: Types.STORE_ADDRESSES_REQUEST });
        callApiToken(dispatch, 'store-address', 'GET', null).then(response => {
            const type = response.status === 0 ? Types.STORE_ADDRESSES_SUCCESS : Types.STORE_ADDRESSES_FAIL;
            dispatch({ type, payload: response });
        });
    };
}

export const fetchPayRequest = (id) => {
    return (dispatch) => {
        dispatch({ type: Types.PAY_URL_REQUEST });
        callApiToken(dispatch, `orders/payment/vnpay_url/${id}`, 'GET', null).then(response => {
            const type = response.status === 0 ? Types.PAY_URL_SUCCESS : Types.PAY_URL_FAIL;
            dispatch({ type, payload: response });
            dispatch(showAlertWithTimeout('Thao tát thất bại, thử lại sau', response.message, false));
        });
    };
}