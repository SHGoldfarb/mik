import {
  allMonthsPending,
  monthStatsPending,
  monthStatsSet,
  allMonthsAdd,
  monthTransactionsPending,
  monthTransactionsSet
} from "./actions";
import {
  dbFetchMonthStats,
  dbGenerateAllMonths,
  dbFetchMonthTransactions
} from "../database/actions";

export const fetchAllMonths = async dispatch => {
  dispatch(allMonthsPending());
  const nextMonth = await dbGenerateAllMonths();
  let month = await nextMonth();
  while (month) {
    dispatch(allMonthsAdd(month));
    // eslint-disable-next-line no-await-in-loop
    month = await nextMonth();
  }
};

export const fetchMonthStats = monthStr => async dispatch => {
  dispatch(monthStatsPending(monthStr));
  const stats = await dbFetchMonthStats(monthStr);
  dispatch(monthStatsSet(monthStr, stats));
};

export const fetchMonthTransactions = monthStr => async dispatch => {
  dispatch(monthTransactionsPending(monthStr));
  const transactions = await dbFetchMonthTransactions(monthStr);
  dispatch(monthTransactionsSet(monthStr, transactions));
};
