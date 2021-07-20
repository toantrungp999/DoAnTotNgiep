import * as Types from "../constants/LocationActTypes";

function citiesReducer(state = { loading: true }, action) {
  switch (action.type) {
    case Types.CITIES_REQUEST:
      return { loading: true }
    case Types.CITIES_REQUEST_SUCCESS:
      return { loading: false, cities: action.payload.data };
    case Types.CITIES_REQUEST_FAIL:
      return { loading: false, message: action.payload.message };
    default: return state;
  }
}

function districtsReducer(state = { loading: true }, action) {
  switch (action.type) {
    case Types.DISTRICTS_REQUEST:
      return { loading: true }
    case Types.DISTRICTS_REQUEST_SUCCESS:
      return { loading: false, districts: action.payload.data };
    case Types.DISTRICTS_REQUEST_FAIL:
      return { loading: false, message: action.payload.message };
    default: return state;
  }
}
export { citiesReducer, districtsReducer }