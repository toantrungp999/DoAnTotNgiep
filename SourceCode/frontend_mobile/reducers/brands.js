import * as Types from '../constants/BrandActTypes';

function brandsReducer(state = {loading: true}, action) {
  switch (action.type) {
    case Types.BRANDS_REQUEST:
      return {loading: true};
    case Types.BRANDS_SUCCESS:
      return {loading: false, brands: action.payload.data};
    case Types.BRANDS_FAIL:
      return {loading: false, message: action.payload.message};
    default:
      return state;
  }
}

function brandReducer(state = {loading: true}, action) {
  switch (action.type) {
    case Types.BRAND_REQUEST:
      return {loading: true};
    case Types.BRAND_SUCCESS:
      return {loading: false, brand: action.payload.data};
    case Types.BRAND_FAIL:
      return {loading: false, message: action.payload.message};
    default:
      return state;
  }
}

export {brandsReducer, brandReducer};
