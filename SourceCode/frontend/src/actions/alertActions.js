import * as Types from "../constants/AlertActTypes";
let nextId = 0;

const makeAlert = (message, description, success) => {
  const id = nextId++;
  return {
    id,
    message,
    description,
    success,
    hiding: false,
  };
};

export function showAlert(message, description, success) {
  const alert = makeAlert(message, description, success);
  return { type: Types.SHOW_ALERT, payload: alert };
}

export function hideAlert(id) {
  return function (dispatch) {
    dispatch({ type: Types.HIDING_ALERT, payload: id });
    setTimeout(() => dispatch({ type: Types.HIDE_ALERT, payload: id }), 500);
  };
}

export function showAlertWithTimeout(message, description, success) {
  return function (dispatch) {
    const alert = makeAlert(message, description, success);
    dispatch({ type: Types.SHOW_ALERT, payload: alert });
    setTimeout(() => dispatch(hideAlert(alert.id)), 5000);
  };
}

export function useAlert(text, description, success) {
  return function (dispatch) {
    const message = text + (success ? " thành công" : " thất bại");
    dispatch(
      showAlertWithTimeout(message, success ? "" : description, success)
    );
  };
}
