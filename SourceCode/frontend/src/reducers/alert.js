import * as Types from "../constants/AlertActTypes";

export default function alertReducer(state = { alerts: [] }, action) {
  switch (action.type) {
    case Types.SHOW_ALERT:
      return { ...state, alerts: [...state.alerts, action.payload] };
    case Types.HIDING_ALERT:
      for (var i = 0; i < state.alerts.length; i++) {
        if (state.alerts[i].id === action.payload) {
          state.alerts[i].hiding = true;
          break;
        }
      }
      return { ...state };
    case Types.HIDE_ALERT:
      return {
        ...state,
        alerts: state.alerts.filter((alert) => alert.id !== action.payload),
      };
    default:
      return state;
  }
}
