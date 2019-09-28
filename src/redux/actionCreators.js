import {
  allMonthsPending,
  monthStatsPending,
  monthStatsSet,
  allMonthsAdd,
  monthTransactionsPending,
  monthTransactionsSet,
  monthDaysPending,
  monthDaysSet,
  dayStatsPending,
  dayStatsSet,
  dayTransactionsPending,
  dayTransactionsSet
} from "./actions";
import {
  dbFetchMonthStats,
  dbGenerateAllMonths,
  dbFetchMonthTransactions,
  dbFetchMonthDays,
  dbFetchDayTransactions,
  dbFetchDayStats
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

export const fetchMonthDays = monthStr => async dispatch => {
  dispatch(monthDaysPending(monthStr));
  const days = await dbFetchMonthDays(monthStr);
  dispatch(monthDaysSet(monthStr, days));
};

export const fetchMonthTransactions = monthStr => async dispatch => {
  dispatch(monthTransactionsPending(monthStr));
  const transactions = await dbFetchMonthTransactions(monthStr);
  dispatch(monthTransactionsSet(monthStr, transactions));
};

export const fetchDayStats = dayStr => async dispatch => {
  dispatch(dayStatsPending(dayStr));
  const stats = await dbFetchDayStats(dayStr);
  dispatch(dayStatsSet(dayStr, stats));
};

export const fetchDayTransactions = dayStr => async dispatch => {
  dispatch(dayTransactionsPending(dayStr));
  const transactions = await dbFetchDayTransactions(dayStr);
  dispatch(dayTransactionsSet(dayStr, transactions));
};
