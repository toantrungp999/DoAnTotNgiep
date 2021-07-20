import * as Types from "../constants/CategoryGroupActTypes";
import { callApiToken, callApi } from '../utils/apiCaller';

export const fectchCategoryGroupsWithCategoryRequest = (status = 'all') => {
    return (dispatch) => {
      dispatch({ type: Types.CATEGORY_GROUPS_WITH_CATEGORY_REQUEST });
      callApi(`category-groups/with-category/${status}`, 'GET', null).then(response => {
        const type = response.status === 0 ? Types.CATEGORY_GROUPS_WITH_CATEGORY_SUCCESS : Types.CATEGORY_GROUPS_WITH_CATEGORY_FAIL;
        dispatch({ type, payload: response });
      });
    };
  }