import * as Types from "../constants/StatisticsActTypes";
import { callApiToken } from "../utils/apiCaller";

export const fetchStatisticsRequest = (
  statisticsType,
  orderType,
  start,
  end
) => {
  return (dispatch) => {
    dispatch({ type: Types.STATISTICS_REQUEST });
    callApiToken(
      dispatch,
      `statistics?statisticsType=${statisticsType}&orderType=${orderType}&start=${start}&end=${end}`,
      "GET",
      null
    ).then((response) => {
      const type =
        response.status === 0
          ? Types.STATISTICS_SUCCESS
          : Types.STATISTICS_FAIL;
      dispatch({ type, payload: response });
    });
  };
};

export const clearStateStatistics = () => {
  return (dispatch) => {
    dispatch({ type: Types.STATISTICS_CLEAR_STATE });
  };
};
