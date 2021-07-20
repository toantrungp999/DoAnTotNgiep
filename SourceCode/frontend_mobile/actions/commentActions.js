import * as Types from "../constants/CommentActTypes";
import { callApiToken, callApi } from '../utils/apiCaller';

export const fectchCommentsRequest = (productId, lengthCmt = 5) => {
    return (dispatch) => {
        dispatch({ type: Types.COMMENTS_REQUEST });
        callApi(`comments/${productId}&pagesize=${lengthCmt}`, 'GET', null).then(response => {
            const type = response.status === 0 ? Types.COMMENTS_SUCCESS : Types.COMMENTS_FAIL;
            dispatch({ type, payload: response });
        });
    };
}

export const createCommentRequest = (data, dataUser) => {
    return (dispatch) => {
        dispatch({ type: Types.COMMENT_CREATE_REQUEST });
        callApiToken(dispatch, 'comments', 'POST', data).then(response => {
            let type = null;
            if (response.status === 0) {
                type = Types.COMMENT_CREATE_SUCCESS;
                const _id = response.data.user;
                response.data.user = dataUser;
                response.data.user._id = _id;
            }
            else
                type = Types.COMMENT_CREATE_FAIL;
            dispatch({ type, payload: response });
        });
    };
}

export const updateCommentRequest = (data) => {
    return (dispatch) => {
        dispatch({ type: Types.COMMENT_UPDATE_REQUEST });
        callApiToken(dispatch, 'comments', 'PUT', data).then(response => {
            if (response.status === 0) {
                response.data = data;
                type = Types.COMMENT_UPDATE_SUCCESS;
            }
            else
                type = Types.COMMENT_UPDATE_FAIL;
            dispatch({ type, payload: response });
           
        });
    };
}

export const deleteCommentRequest = (data) => {
    return (dispatch) => {
        dispatch({ type: Types.COMMENT_DELETE_REQUEST });
        callApiToken(dispatch, 'comments', 'DELETE', data).then(response => {
            let type = null;
            if (response.status === 0) {
                type = Types.COMMENT_DELETE_SUCCESS;
                response.data = data;
            }
            else
                type = Types.COMMENT_DELETE_FAIL;
            dispatch({ type, payload: response });
        });
    };
}

export const createReplyRequest = (data) => {
    return (dispatch) => {
        dispatch({ type: Types.REPLY_CREATE_REQUEST });
        callApiToken(dispatch, 'comments/replies', 'POST', data).then(response => {
            const type = response.status === 0 ? Types.REPLY_CREATE_SUCCESS : Types.REPLY_CREATE_FAIL;
            dispatch({ type, payload: response });
        });
    };
}

export const updateReplyRequest = (data) => {
    return (dispatch) => {
        dispatch({ type: Types.REPLY_UPDATE_REQUEST });
        callApiToken(dispatch, 'comments/replies', 'PUT', data).then(response => {
            const type = response.status === 0 ? Types.REPLY_UPDATE_SUCCESS : Types.REPLY_UPDATE_FAIL;
            dispatch({ type, payload: response });
        });
    };
}

export const deleteReplyRequest = (data) => {
    return (dispatch) => {
        dispatch({ type: Types.REPLY_DELETE_REQUEST });
        callApiToken(dispatch, 'comments/replies', 'DELETE', data).then(response => {
            let type = null;
            console.log(response);
            if (response.status === 0) {
                type = Types.REPLY_DELETE_SUCCESS;
                response.data = data;
            }
            else
                type = Types.REPLY_DELETE_FAIL;
            dispatch({ type, payload: response });
        });
    };
}