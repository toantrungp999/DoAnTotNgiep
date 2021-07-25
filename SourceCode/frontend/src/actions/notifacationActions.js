import * as Types from "../constants/NotificationActTypes";
import { callApiToken } from "../utils/apiCaller";

export const fectchNotificationsRequest = (admin = "false", pageSize = 5) => {
  return (dispatch) => {
    dispatch({ type: Types.NOTIFICATIONS_REQUEST });
    callApiToken(
      dispatch,
      `notifications/admin=${admin}&pagesize=${pageSize}`,
      "GET",
      null
    ).then((response) => {
      const type =
        response.status === 0
          ? Types.NOTIFICATIONS_SUCCESS
          : Types.NOTIFICATIONS_FAIL;
      dispatch({ type, payload: response });
    });
  };
};

export const updateNotificationRequest = (_id) => {
  return (dispatch) => {
    dispatch({ type: Types.NOTIFICATION_UPDATE_REQUEST });
    callApiToken(dispatch, `notifications/${_id}`, "PUT", null).then(
      (response) => {
        let type = null;
        if (response.status === 0) {
          type = Types.NOTIFICATION_UPDATE_SUCCESS;
          response.data = _id;
        } else type = Types.NOTIFICATION_UPDATE_FAIL;
        dispatch({ type, payload: response });
      }
    );
  };
};

export const clearNotify = () => {
  return (dispatch) => {
    dispatch({ type: Types.NOTIFICATION_CLEAR });
  };
};
