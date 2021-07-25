import * as Types from '../constants/UsersActTypes';

function allUserReducer(state = {}, action) {
  switch (action.type) {
    case Types.USERS_GET_ALL_REQUEST:
      return {loading: true};
    case Types.USERS_GET_ALL_SUCCESS:
      return {loading: false, users: action.payload.data};
    case Types.USERS_GET_ALL_FAIL:
      return {loading: false, message: action.payload.message};
    default:
      return state;
  }
}

export {allUserReducer};
