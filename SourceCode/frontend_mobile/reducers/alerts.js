import * as Types from '../constants/AlertActTypes';

export default function alertReducer(state = {alert: null}, action) {
  switch (action.type) {
    case Types.SHOW_ALERT:
      return {alert: action.payload};
    case Types.HIDING_ALERT:
      return {alert: null};
    case Types.HIDE_ALERT:
      return {alert: null};
    default:
      return state;
  }
}

export {alertReducer};
