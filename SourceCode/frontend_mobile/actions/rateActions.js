import * as Types from "../constants/RateActTypes";
import { callApiToken, callApi } from '../utils/apiCaller';


export const fectchRatesRequest = (productId, lengthRate = 5) => {
    return (dispatch) => {
        dispatch({ type: Types.RATES_REQUEST });
        callApi(`rates/${productId}&pagesize=${lengthRate}`, 'GET', null).then(response => {
            const type = response.status === 0 ? Types.RATES_SUCCESS : Types.RATES_FAIL;
            dispatch({ type, payload: response });
        });
    };
}

export const createRateRequest = (data, dataUser) => {
    return (dispatch) => {
        dispatch({ type: Types.RATE_CREATE_REQUEST });
        callApiToken(dispatch, 'rates', 'POST', data).then(response => {
            console.log(response)
            let type = null;
            if (response.status === 0) {
                type = Types.RATE_CREATE_SUCCESS;
                response.data.user = dataUser;
            }
            else
                type = Types.RATE_CREATE_FAIL;
            dispatch({ type, payload: response });
        });
    };
}

export const updateRateRequest = (data) => {
    return (dispatch) => {
        dispatch({ type: Types.RATE_UPDATE_REQUEST });
        callApiToken(dispatch, 'rates', 'PUT', data).then(response => {
            let type = null;
            if (response.status === 0) {
                type = Types.RATE_UPDATE_SUCCESS;
                response.data = data;
            }
            else
                type = Types.RATE_UPDATE_FAIL;
            dispatch({ type, payload: response });
        });
    };
}

export const deleteRateRequest = (data) => {
    return (dispatch) => {
        dispatch({ type: Types.RATE_DELETE_REQUEST });
        callApiToken(dispatch, 'rates', 'DELETE', data).then(response => {
            let type = null;
            if (response.status === 0) {
                type = Types.RATE_DELETE_SUCCESS;
                response.data = data;
            }
            else
                type = Types.RATE_DELETE_FAIL;
            dispatch({ type, payload: response });
        });
    };
}

export const createRateReplyRequest = (data) => {
    return (dispatch) => {
        dispatch({ type: Types.RATE_REPLY_CREATE_REQUEST });
        callApiToken(dispatch, 'rates/replies', 'POST', data).then(response => {
            const type = response.status === 0 ? Types.RATE_REPLY_CREATE_SUCCESS : Types.RATE_REPLY_CREATE_FAIL;
            dispatch({ type, payload: response });
        });
    };
}

export const updateRateReplyRequest = (data) => {
    return (dispatch) => {
        dispatch({ type: Types.RATE_REPLY_UPDATE_REQUEST });
        callApiToken(dispatch, 'rates/replies', 'PUT', data).then(response => {
            const type = response.status === 0 ? Types.RATE_REPLY_UPDATE_SUCCESS : Types.RATE_REPLY_UPDATE_FAIL;
            dispatch({ type, payload: response });
        });
    };
}

export const deleteRateReplyRequest = (data) => {
    return (dispatch) => {
        dispatch({ type: Types.RATE_REPLY_DELETE_REQUEST });
        callApiToken(dispatch, 'rates/replies', 'DELETE', data).then(response => {
            let type = null;
            if (response.status === 0) {
                type = Types.RATE_REPLY_DELETE_SUCCESS;
                response.data = data;
            }
            else
                type = Types.RATE_REPLY_DELETE_FAIL;
            dispatch({ type, payload: response });
        });
    };
}
