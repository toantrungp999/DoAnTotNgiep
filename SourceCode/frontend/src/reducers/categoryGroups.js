import * as Types from "../constants/CategoryGroupActTypes";
import { findIndexById } from "../extentions/ArrayEx";

function categoryGroupsReducer(state = { loading: true }, action) {
  switch (action.type) {
    case Types.CATEGORY_GROUPS_REQUEST:
      return { loading: true };
    case Types.CATEGORY_GROUPS_SUCCESS:
      return { loading: false, categoryGroups: action.payload.data };
    case Types.CATEGORY_GROUPS_FAIL:
      return { loading: false, message: action.payload.message };

    case Types.CATEGORY_GROUPS_WITH_CATEGORY_REQUEST:
      return { loading: true };
    case Types.CATEGORY_GROUPS_WITH_CATEGORY_SUCCESS:
      return { loading: false, categoryGroups: action.payload.data };
    case Types.CATEGORY_GROUPS_WITH_CATEGORY_FAIL:
      return { loading: false, message: action.payload.message };

    case Types.CATEGORY_GROUP_CREATE_REQUEST:
      state.message = "";
      state.updateStatus = undefined;
      state.createStatus = undefined;
      state.createLoading = true;
      return { ...state };
    case Types.CATEGORY_GROUP_CREATE_SUCCESS:
      state.createStatus = true;
      state.createLoading = false;
      state.categoryGroups.push(action.payload.data);
      return { ...state };
    case Types.CATEGORY_GROUP_CREATE_FAIL:
      state.createLoading = false;
      state.createStatus = false;
      state.message = action.payload.message;
      return { ...state };
    case Types.CATEGORY_GROUP_UPDATE_REQUEST:
      state.message = "";
      state.updateLoading = true;
      state.updateStatus = undefined;
      state.createStatus = undefined;
      return { ...state };
    case Types.CATEGORY_GROUP_UPDATE_SUCCESS:
      var type = action.payload.data;
      var index = findIndexById(state.categoryGroups, type._id);
      if (index >= 0) state.categoryGroups[index] = type;
      state.updateLoading = false;
      state.updateStatus = true;
      return { ...state };
    case Types.CATEGORY_GROUP_UPDATE_FAIL:
      state.updateLoading = false;
      state.updateStatus = false;
      state.message = action.payload.message;
      return { ...state };
    default:
      return state;
  }
}

export { categoryGroupsReducer };
