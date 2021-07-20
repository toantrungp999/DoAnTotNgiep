import * as Types from "../constants/NotificationActTypes";
import { findIndexById } from "./../extentions/ArrayEx";

function notificationsReducer(state = { loading: false }, action) {
    let index;
    switch (action.type) {
        case Types.NOTIFICATIONS_REQUEST:
            state.loading = true;
            return { ...state };
        case Types.NOTIFICATIONS_FEED_NEWS_REQUEST:
            state.feedNews = true;
            return { ...state };
        case Types.NOTIFICATIONS_SUCCESS:
            const notifications = action.payload.data.notifications;
            const pagingInfo = action.payload.data.pagingInfo;
            state.loading = false;
            for (let i = 0; i < notifications.length; i++) {
                console.log(notifications[i]._id);
                index = findIndexById(state.notifications, notifications[i]._id);
                if (index === -1) {
                    state.notifications.push(notifications[i]);
                }
            }
            state.pagingInfo = pagingInfo;
            return { ...state };
        case Types.NOTIFICATIONS_FEED_NEWS_SUCCESS:
            state.feedNews = false;
            const newNotifications = action.payload.data.notifications;
            if (!state.notifications) {
                state.notifications = newNotifications;
                state.pagingInfo = action.payload.data.pagingInfo;
            }
            else
                for (let i = newNotifications.length - 1; i >= 0; i--) {
                    index = findIndexById(state.notifications, newNotifications[i]._id);
                    if (index === -1) {
                        state.notifications.unshift(newNotifications[i]);
                    }
                }
            return { ...state };
        case Types.NOTIFICATIONS_FAIL:
            state.loading = false;
            state.message = action.payload.message;
            return { ...state };
        case Types.NOTIFICATIONS_FEED_NEWS_FAIL:
            state.feedNews = false;
            state.message = action.payload.message;
            return { ...state };
        case Types.NOTIFICATION_UPDATE_REQUEST:
            state.message = '';
            state.updateLoading = true;
            state.updateStatus = false;
            return { ...state };
        case Types.NOTIFICATION_UPDATE_SUCCESS:
            const _id = action.payload.data;
            index = findIndexById(state.notifications, _id);
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