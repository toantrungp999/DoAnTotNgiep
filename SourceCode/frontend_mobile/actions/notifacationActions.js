import * as Types from "../constants/NotificationActTypes";
import { callApiToken } from '../utils/apiCaller';


export const fectchNotificationsRequest = (pageSize, page) => {
  return (dispatch) => {
    dispatch({ type: Types.NOTIFICATIONS_REQUEST });
    callApiToken(dispatch, `notifications/mobile/pageSize=${pageSize}&page=${page}`, 'GET', null).then(response => {
      const type = response.status === 0 ? Types.NOTIFICATIONS_SUCCESS : Types.NOTIFICATIONS_FAIL;
      dispatch({ type, payload: response });
    });
  };
}

export const fectchNewNotificationsRequest = (pageSize = 5, page = 1) => {
  return (dispatch) => {
    dispatch({ type: Types.NOTIFICATIONS_FEED_NEWS_REQUEST });
    callApiToken(dispatch, `notifications/mobile/pageSize=${pageSize}&page=${page}`, 'GET', null).then(response => {
      const type = response.status === 0 ? Types.NOTIFICATIONS_FEED_NEWS_SUCCESS : Types.NOTIFICATIONS_FEED_NEWS_FAIL;
      dispatch({ type, payload: response });
    });
  };
}

export const updateNotificationRequest = (_id) => {
  return (dispatch) => {
    dispatch({ type: Types.NOTIFICATION_UPDATE_REQUEST });
    callApiToken(dispatch, `notifications/${_id}`, 'PUT', null).then(response => {
      let type = null;
      if (response.status === 0) {
        type = Types.NOTIFICATION_UPDATE_SUCCESS;
        response.data = _id;
      }
      else
        type = Types.NOTIFICATION_UPDATE_FAIL;
      dispatch({ type, payload: response });
    });
  };
}

export const clearNotify = () => {
  return (dispatch) => { dispatch({ type: Types.NOTIFICATION_CLEAR }); }
}