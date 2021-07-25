import * as Types from '../constants/CategoryGroupActTypes';

function categoryGroupsReducer(state = {loading: true}, action) {
  switch (action.type) {
    case Types.CATEGORY_GROUPS_WITH_CATEGORY_REQUEST:
      return {loading: true};
    case Types.CATEGORY_GROUPS_WITH_CATEGORY_SUCCESS:
      return {loading: false, categoryGroups: action.payload.data};
    case Types.CATEGORY_GROUPS_WITH_CATEGORY_FAIL:
      return {loading: false, message: action.payload.message};
    default:
      return state;
  }
}

export {categoryGroupsReducer};
