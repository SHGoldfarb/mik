import {
  SET_TRANSACTIONS,
  ADD_TRANSACTION,
  DELETE_TRANSACTION,
  CREATE_OR_UPDATE_TRANSACTION,
  ALL_MONTHS_PENDING,
  ALL_MONTHS_SET,
  MONTH_STATS_PENDING,
  MONTH_STATS_SET,
  ALL_MONTHS_ADD,
  MONTH_TRANSACTIONS_PENDING,
  MONTH_TRANSACTIONS_SET,
  MONTH_DAYS_PENDING,
  MONTH_DAYS_SET,
  DAY_STATS_PENDING,
  DAY_STATS_SET,
  DAY_TRANSACTIONS_PENDING,
  DAY_TRANSACTIONS_SET,
  TRANSACTION_PENDING,
  TRANSACTION_SET,
  ALL_TAGS_PENDING,
  ALL_TAGS_SET,
  SET_FETCHING,
  SET_FETCHED
} from "./actionTypes";

export const setTransactions = transactions => ({
  type: SET_TRANSACTIONS,
  payload: transactions
});

export const addTransaction = transaction => ({
  type: ADD_TRANSACTION,
  payload: transaction
});

export const oldCreateOrUpdateTransaction = transaction => ({
  type: CREATE_OR_UPDATE_TRANSACTION,
  payload: { transaction }
});

export const oldDeleteTransaction = id => ({
  type: DELETE_TRANSACTION,
  payload: id
});

export const allMonthsPending = () => ({
  type: ALL_MONTHS_PENDING
});

export const allMonthsSet = months => ({
  type: ALL_MONTHS_SET,
  payload: months
});

export const allMonthsAdd = month => ({
  type: ALL_MONTHS_ADD,
  payload: month
});

export const monthStatsPending = monthStr => ({
  type: MONTH_STATS_PENDING,
  payload: monthStr
});

export const monthStatsSet = (monthStr, stats) => ({
  type: MONTH_STATS_SET,
  payload: {
    monthStr,
    stats
  }
});

export const monthDaysPending = monthStr => ({
  type: MONTH_DAYS_PENDING,
  payload: monthStr
});

export const monthDaysSet = (monthStr, days) => ({
  type: MONTH_DAYS_SET,
  payload: {
    monthStr,
    days
  }
});

export const monthTransactionsPending = monthStr => ({
  type: MONTH_TRANSACTIONS_PENDING,
  payload: monthStr
});

export const monthTransactionsSet = (monthStr, transactions) => ({
  type: MONTH_TRANSACTIONS_SET,
  payload: {
    monthStr,
    transactions
  }
});

export const dayStatsPending = dayStr => ({
  type: DAY_STATS_PENDING,
  payload: dayStr
});

export const dayStatsSet = (dayStr, stats) => ({
  type: DAY_STATS_SET,
  payload: {
    dayStr,
    stats
  }
});

export const dayTransactionsPending = dayStr => ({
  type: DAY_TRANSACTIONS_PENDING,
  payload: dayStr
});

export const dayTransactionsSet = (dayStr, transactions) => ({
  type: DAY_TRANSACTIONS_SET,
  payload: {
    dayStr,
    transactions
  }
});

export const transactionPending = id => ({
  type: TRANSACTION_PENDING,
  payload: id
});

export const transactionSet = transaction => ({
  type: TRANSACTION_SET,
  payload: transaction
});

export const allTagsPending = () => ({
  type: ALL_TAGS_PENDING
});

export const allTagsSet = tags => ({
  type: ALL_TAGS_SET,
  payload: tags
});

export const setFetching = (query, variables) => ({
  type: SET_FETCHING,
  payload: { query, variables }
});

export const setFetched = (query, variables, data) => ({
  type: SET_FETCHED,
  payload: { query, variables, data }
});
