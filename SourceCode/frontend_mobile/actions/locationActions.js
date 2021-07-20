import * as Types from "../constants/LocationActTypes";
import { callApi } from './../utils/apiCaller';

export const fetchCitiesRequest = () => {
  return (dispatch) => {
    dispatch({ type: Types.CITIES_REQUEST });
    callApi('location/cities', 'GET', null).then(response => {
      const type = response.status === 0 ? Types.CITIES_REQUEST_SUCCESS : Types.CITIES_REQUEST_FAIL;
      dispatch({ type, payload: response });
    });
  };
}

export const fetchDistrictsRequest = (id) => {
  return (dispatch) => {
    dispatch({ type: Types.DISTRICTS_REQUEST });
    callApi(`location/districts/${id}`, 'GET', null).then(response => {
      const type = response.status === 0 ? Types.DISTRICTS_REQUEST_SUCCESS : Types.DISTRICTS_REQUEST_FAIL;
      dispatch({ type, payload: response });
    });
  };
}