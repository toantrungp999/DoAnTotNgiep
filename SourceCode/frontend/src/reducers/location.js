import * as Types from "../constants/LocationActTypes";

function citiesReducer(state = { loading: true }, action) {
  switch (action.type) {
    case Types.CITIES_REQUEST:
      return { loading: true };
    case Types.CITIES_REQUEST_SUCCESS:
      return { loading: false, cities: action.payload.data };
    case Types.CITIES_REQUEST_FAIL:
      return { loading: false, message: action.payload.message };
    default:
      return state;
  }
}

function districtsReducer(state = { loading: true }, action) {
  switch (action.type) {
    case Types.DISTRICTS_REQUEST:
      return { loading: true };
    case Types.DISTRICTS_REQUEST_SUCCESS:
      return { loading: false, districts: action.payload.data };
    case Types.DISTRICTS_REQUEST_FAIL:
      return { loading: false, message: action.payload.message };
    default:
      return state;
  }
}

function mapReducer(state = { loading: true }, action) {
  switch (action.type) {
    case Types.MAP_CLEAR_STATE:
      return { loading: true };

    case Types.GEOCODE_REQUEST:
      state.loading = true;
      return { ...state };
    case Types.GEOCODE_SUCCESS:
      state.loading = false;
      state.address = action.payload.data.formatted_address;
      state.location = action.payload.data.geometry.location;
      state.address_component = action.payload.data.address_component;
      return { ...state };
    case Types.GEOCODE_FAIL:
      state.loading = false;
      state.message = action.payload.message;
      return { ...state };

    case Types.LOCATION_REQUEST:
      state.loading = true;
      return { ...state };
    case Types.LOCATION_SUCCESS:
      state.loading = false;
      state.address = action.payload.data.formatted_address;
      state.location = action.payload.data.geometry.location;
      state.address_component = action.payload.data.address_component;
      return { ...state };
    case Types.LOCATION_FAIL:
      state.loading = false;
      state.message = action.payload.message;
      return { ...state };
    default:
      return state;
  }
}

export { citiesReducer, districtsReducer, mapReducer };
