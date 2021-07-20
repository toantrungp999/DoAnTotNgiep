import * as Types from "../constants/RateActTypes";
import { findIndexById } from './../extentions/ArrayEx';

function ratesReducer(state = { loading: true }, action) {
    let rate;
    let index;
    switch (action.type) {
        case Types.RATES_REQUEST:
            state.loading = true;
            state.message = '';
            return { ...state };
        case Types.RATES_SUCCESS:
            return { loading: false, rates: action.payload.data.rates, total: action.payload.data.total };
        case Types.RATES_FAIL:
            return { loading: false, message: action.payload.message };
        case Types.RATE_CREATE_REQUEST:
            state.message = '';
            state.createLoading = true;
            return { ...state };
        case Types.RATE_CREATE_SUCCESS:
            state.createLoading = false;
            state.rates.unshift(action.payload.data);
            return { ...state };
        case Types.RATE_CREATE_FAIL:
            state.createLoading = false;
            state.createStatus = true;
            state.message = action.payload.message;
            return { ...state };
        case Types.RATE_UPDATE_REQUEST:
            state.message = '';
            state.updateLoading = true;
            return { ...state };
        case Types.RATE_UPDATE_SUCCESS:
            rate = action.payload.data;
            index = findIndexById(state.rates, rate.rateId);
            if (index >= 0) {
                state.rates[index].content = rate.content;
                state.rates[index].rate = Number(rate.rate);
            }
            state.updateLoading = false;
            return { ...state };
        case Types.RATE_UPDATE_FAIL:
            state.updateLoading = false;
            state.message = action.payload.message;
            return { ...state };
        case Types.RATE_DELETE_REQUEST:
            state.message = '';
            state.deleteLoading = true;
            return { ...state };
        case Types.RATE_DELETE_SUCCESS:
            rate = action.payload.data;
            index = findIndexById(state.rates, rate.rateId);
            if (index >= 0) state.rates.splice(index, 1);
            state.deleteLoading = false;
            return { ...state };
        case Types.RATE_DELETE_FAIL:
            state.deleteLoading = false;
            state.message = action.payload.message;
            return { ...state };
        ///
        case Types.RATE_REPLY_CREATE_REQUEST:
            state.message = '';
            state.createReplyLoading = true;
            return { ...state };
        case Types.RATE_REPLY_CREATE_SUCCESS:
            state.createReplyLoading = false;
            rate = action.payload.data;
            index = findIndexById(state.rates, rate._id);
            if (index >= 0)
                state.rates[index] = rate;
            return { ...state };
        case Types.RATE_REPLY_CREATE_FAIL:
            state.createReplyLoading = false;
            state.message = action.payload.message;
            return { ...state };
        case Types.RATE_REPLY_UPDATE_REQUEST:
            state.message = '';
            state.updateReplyLoading = true;
            return { ...state };
        case Types.RATE_REPLY_UPDATE_SUCCESS:
            rate = action.payload.data;
            index = findIndexById(state.rates, rate._id);
            if (index >= 0)
                state.rates[index] = rate;
            state.updateReplyLoading = false;
            return { ...state };
        case Types.RATE_REPLY_UPDATE_FAIL:
            state.updateReplyLoading = false;
            state.message = action.payload.message;
            return { ...state };
        case Types.RATE_REPLY_DELETE_REQUEST:
            state.message = '';
            state.deleteReplyLoading = true;
            return { ...state };
        case Types.RATE_REPLY_DELETE_SUCCESS:
            state.deleteReplyLoading = false;
            var data = action.payload.data;
            index = findIndexById(state.rates, data.rateId);
            if (index >= 0) {
                var indexReply = findIndexById(state.rates[index].replies, data.replyId);
                if (indexReply >= 0)
                    state.rates[index].replies.splice(indexReply, 1);
            }
            return { ...state };
        case Types.RATE_REPLY_DELETE_FAIL:
            state.deleteReplyLoading = false;
            state.message = action.payload.message;
            return { ...state };
        default: return state;
    }
}

export { ratesReducer }