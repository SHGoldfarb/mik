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
  MONTH_TRANSACTIONS_SET
} from "./actionTypes";

export const setTransactions = transactions => ({
  type: SET_TRANSACTIONS,
  payload: transactions
});

export const addTransaction = transaction => ({
  type: ADD_TRANSACTION,
  payload: transaction
});

export const createOrUpdateTransaction = transaction => ({
  type: CREATE_OR_UPDATE_TRANSACTION,
  payload: transaction
});

export const deleteTransaction = id => ({
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
