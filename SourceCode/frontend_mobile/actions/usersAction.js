import * as Types from "../constants/UsersActTypes";
import { callApiToken } from '../utils/apiCaller';

export const fectchAllUsersRequest = () => {
    return (dispatch) => {
      dispatch({ type: Types.USERS_GET_ALL_REQUEST });
      callApiToken(dispatch, 'users/getall', 'GET', null).then(response => {
        const type = response.status === 0 ? Types.USERS_GET_ALL_SUCCESS : Types.USERS_GET_ALL_FAIL;
        dispatch({ type, payload: response });
      });
    };
  }