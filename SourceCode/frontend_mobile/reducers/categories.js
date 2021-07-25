import * as Types from '../constants/CategoryActTypes';
import {findIndexById} from '../extentions/ArrayEx';

function categoriesReducer(state = {loading: true}, action) {
  switch (action.type) {
    case Types.CATEGORIES_REQUEST:
      return {loading: true};
    case Types.CATEGORIES_SUCCESS:
      return {loading: false, categories: action.payload.data};
    case Types.CATEGORIES_FAIL:
      return {loading: false, message: action.payload.message};
    case Types.CATEGORY_CREATE_REQUEST:
      state.message = '';
      state.updateStatus = undefined;
      state.createStatus = undefined;
      state.createLoading = true;
      return {...state};
    case Types.CATEGORY_CREATE_SUCCESS:
      state.createStatus = true;
      state.createLoading = false;
      state.categories.push(action.payload.data);
      return {...state};
    case Types.CATEGORY_CREATE_FAIL:
      state.createLoading = false;
      state.createStatus = false;
      state.message = action.payload.message;
      return {...state};
    case Types.CATEGORY_UPDATE_REQUEST:
      state.message = '';
      state.updateLoading = true;
      state.updateStatus = undefined;
      state.createStatus = undefined;
      return {...state};
    case Types.CATEGORY_UPDATE_SUCCESS:
      var type = action.payload.data;
      var index = findIndexById(state.categories, type._id);
      if (index >= 0) state.categories[index] = type;
      state.updateLoading = false;
      state.updateStatus = true;
      return {...state};
    case Types.CATEGORY_UPDATE_FAIL:
      state.updateLoading = false;
      state.updateStatus = false;
      state.message = action.payload.message;
      return {...state};
    default:
      return state;
  }
}

export {categoriesReducer};
