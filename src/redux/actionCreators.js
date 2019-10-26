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
  dayTransactionsSet,
  transactionPending,
  transactionSet,
  allTagsPending,
  allTagsSet
} from "./actions";
import {
  dbFetchMonthStats,
  dbGenerateAllMonths,
  dbFetchMonthTransactions,
  dbFetchMonthDays,
  dbFetchDayTransactions,
  dbFetchDayStats,
  dbDeleteTransaction,
  dbCreateTransaction,
  dbFetchTransaction,
  dbFetchAllTags
} from "../database/actions";
import { getDateStrings } from "../utils/date";

export const fetchAllMonths = async dispatch => {
  const pendingPromise = dispatch(allMonthsPending());
  const nextMonth = await dbGenerateAllMonths();
  let month = await nextMonth();
  await pendingPromise;
  while (month) {
    dispatch(allMonthsAdd(month));
    // eslint-disable-next-line no-await-in-loop
    month = await nextMonth();
  }
};

export const fetchMonthStats = monthStr => async dispatch => {
  const pendingPromise = dispatch(monthStatsPending(monthStr));
  const stats = await dbFetchMonthStats(monthStr);
  await pendingPromise;
  return dispatch(monthStatsSet(monthStr, stats));
};

export const fetchMonthDays = monthStr => async dispatch => {
  const pendingPromise = dispatch(monthDaysPending(monthStr));
  const days = await dbFetchMonthDays(monthStr);
  await pendingPromise;
  return dispatch(monthDaysSet(monthStr, days));
};

export const fetchMonthTransactions = monthStr => async dispatch => {
  const pendingPromise = dispatch(monthTransactionsPending(monthStr));
  const transactions = await dbFetchMonthTransactions(monthStr);
  await pendingPromise;
  return dispatch(monthTransactionsSet(monthStr, transactions));
};

export const fetchDayStats = dayStr => async dispatch => {
  const pendingPromise = dispatch(dayStatsPending(dayStr));
  const stats = await dbFetchDayStats(dayStr);
  await pendingPromise;
  return dispatch(dayStatsSet(dayStr, stats));
};

export const fetchDayTransactions = dayStr => async dispatch => {
  const pendingPromise = dispatch(dayTransactionsPending(dayStr));
  const transactions = await dbFetchDayTransactions(dayStr);
  await pendingPromise;
  return dispatch(dayTransactionsSet(dayStr, transactions));
};

export const fetchTransaction = id => async dispatch => {
  const pendingPromise = dispatch(transactionPending(id));
  const transaction = await dbFetchTransaction(id);
  await pendingPromise;
  return dispatch(transactionSet(transaction));
};

export const fetchAllTags = async dispatch => {
  const pendingPromise = dispatch(allTagsPending());
  const allTags = await dbFetchAllTags();
  await pendingPromise;
  return dispatch(allTagsSet(allTags));
};

const updateEverythingAboutTransaction = dispatch => async transaction => {
  const { monthStr, dayStr } = getDateStrings(transaction.date);
  const dayTransactionsPromise = dbFetchDayTransactions(dayStr);
  const dayStatsPromise = dbFetchDayStats(dayStr);
  const monthTransactionsPromise = dbFetchMonthTransactions(monthStr);
  const monthStatsPromise = dbFetchMonthStats(monthStr);
  const transactionInDbPromise = transaction.id
    ? dbFetchTransaction(transaction.id)
    : new Promise(r => r(undefined));
  const [
    dayTransactions,
    dayStats,
    monthTransactions,
    monthStats,
    transactionInDb
  ] = await Promise.all([
    dayTransactionsPromise,
    dayStatsPromise,
    monthTransactionsPromise,
    monthStatsPromise,
    transactionInDbPromise
  ]);
  return Promise.all([
    dispatch(monthStatsSet(monthStr, monthStats)),
    dispatch(monthTransactionsSet(monthStr, monthTransactions)),
    dispatch(dayStatsSet(dayStr, dayStats)),
    dispatch(dayTransactionsSet(dayStr, dayTransactions)),
    transactionInDb && dispatch(transactionSet(transactionInDb))
  ]);
};

export const upsertTransaction = dispatch => async transaction => {
  console.log(transaction);
  if (transaction.id !== undefined) {
    const oldTransaction = await dbDeleteTransaction(transaction.id);
    await updateEverythingAboutTransaction(dispatch)(oldTransaction);
  }
  console.log(transaction);
  const newTransaction = await dbCreateTransaction(transaction);
  console.log(newTransaction);
  await updateEverythingAboutTransaction(dispatch)(newTransaction);
  console.log(newTransaction);
  return newTransaction;
};

export const deleteTransaction = dispatch => async id => {
  const oldTransaction = await dbDeleteTransaction(id);
  await updateEverythingAboutTransaction(dispatch)(oldTransaction);

  return oldTransaction;
};
