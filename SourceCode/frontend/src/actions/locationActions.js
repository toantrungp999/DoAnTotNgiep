import * as Types from "../constants/LocationActTypes";
import { callApi } from "./../utils/apiCaller";

export const fetchCitiesRequest = () => {
  return (dispatch) => {
    dispatch({ type: Types.CITIES_REQUEST });
    callApi("location/cities", "GET", null).then((response) => {
      const type =
        response.status === 0
          ? Types.CITIES_REQUEST_SUCCESS
          : Types.CITIES_REQUEST_FAIL;
      dispatch({ type, payload: response });
    });
  };
};

export const fetchDistrictsRequest = (id) => {
  return (dispatch) => {
    dispatch({ type: Types.DISTRICTS_REQUEST });
    callApi(`location/districts/${id}`, "GET", null).then((response) => {
      const type =
        response.status === 0
          ? Types.DISTRICTS_REQUEST_SUCCESS
          : Types.DISTRICTS_REQUEST_FAIL;
      dispatch({ type, payload: response });
    });
  };
};

export const mapClearState = () => {
  return (dispatch) => {
    dispatch({ type: Types.MAP_CLEAR_STATE });
  };
};

export const getGeocodeRequest = (data) => {
  return (dispatch) => {
    dispatch({ type: Types.GEOCODE_REQUEST });
    callApi(
      `location/geocode?city=${data.city}&district=${data.district}&ward=${data.ward}&streetOrBuilding=${data.streetOrBuilding}`,
      "GET"
    ).then((response) => {
      console.log(response);
      const type =
        response.status === 0 ? Types.GEOCODE_SUCCESS : Types.GEOCODE_FAIL;
      dispatch({ type, payload: response });
    });
  };
};

export const getLocationRequest = (data) => {
  return (dispatch) => {
    dispatch({ type: Types.LOCATION_REQUEST });
    callApi(`location/location?lat=${data.lat}&lng=${data.lng}`, "GET").then(
      (response) => {
        console.log(response);
        const type =
          response.status === 0 ? Types.LOCATION_SUCCESS : Types.LOCATION_FAIL;
        dispatch({ type, payload: response });
      }
    );
  };
};
