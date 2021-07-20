import * as Types from "../constants/NotificationActTypes";
import { findIndexById } from "./../extentions/ArrayEx";

function notificationsReducer(state = { loading: true }, action) {
    switch (action.type) {
        case Types.NOTIFICATIONS_REQUEST:
            state.loading = true;
            return { ...state };
        case Types.NOTIFICATIONS_SUCCESS:
            state.loading = false;
            if (state.notifications !== action.payload.data.notifications) {
                state.notifications = action.payload.data.notifications;
                state.total = action.payload.data.total;
                state.totalCart = action.payload.data.totalCart;
            }
            return { ...state };
        case Types.NOTIFICATIONS_FAIL:
            state.loading = false;
            state.message = action.payload.message;
            return { ...state };
        case Types.NOTIFICATION_UPDATE_REQUEST:
            state.message = '';
            state.updateLoading = true;
            state.updateStatus = false;
            return { ...state };
        case Types.NOTIFICATION_UPDATE_SUCCESS:
            const _id = action.payload.data;
            const index = findIndexById(state.notifications, _id);
            if (index >= 0)
                state.notifications[index].check = true;
            state.updateLoading = false;
            state.updateStatus = true;
            return { ...state };
        case Types.NOTIFICATION_UPDATE_FAIL:
            state.updateLoading = false;
            state.updateStatus = false;
            state.message = action.payload.message;
            return { ...state };
        case Types.NOTIFICATION_CLEAR:
            return { loading: true };
        default: return state;
    }
}

export { notificationsReducer }