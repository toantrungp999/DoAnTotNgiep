import * as Types from "../constants/StatisticsActTypes";

function statisticsReducer(state = { loading: false }, action) {
  switch (action.type) {
    case Types.STATISTICS_REQUEST:
      return { loading: true };
    case Types.STATISTICS_SUCCESS:
      return {
        loading: false,
        revenue: action.payload.data.revenue,
        sales: action.payload.data.sales,
      };
    case Types.STATISTICS_FAIL:
      return { loading: false, message: action.payload.message };

    case Types.STATISTICS_CLEAR_STATE:
      return { loading: false };

    default:
      return state;
  }
}

export { statisticsReducer };
