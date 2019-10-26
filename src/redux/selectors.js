import PropTypes from "prop-types";
import { createSelector } from "reselect";
import flatten from "../utils/flatten";
import uniques from "../utils/uniques";
import { getTotal, getIncomeExpense } from "../utils/stats";
import { transactionPropType } from "../utils/propTypes";
import {
  selectAllMonthsQuery,
  selectMonthStatsQuery,
  selectMonthTransactionsQuery,
  selectMonthDaysQuery,
  selectDayStatsQuery,
  selectDayTransactionsQuery,
  selectTransactionQuery,
  selectAllTagsQuery
} from "../database/queries";
import { getDateStrings } from "../utils/date";

const parseTransaction = ({ amount, tags, ...rest }) => ({
  amount: amount || 0,
  tags: tags || [],
  ...rest
});

export const oldSelectTransaction = (state, id) =>
  state.transactions && state.transactions[id]
    ? { ...parseTransaction(state.transactions[id]), id }
    : null;

const selectAllTransactionsUnordered = state =>
  state.transactions
    ? Object.keys(state.transactions).map(id => ({
        ...parseTransaction(state.transactions[id]),
        id
      }))
    : [];

export const selectAllTransactions = createSelector(
  selectAllTransactionsUnordered,
  transactions => transactions.sort((a, b) => -a.date + b.date)
);

export const selectAllMonths = state => state[selectAllMonthsQuery] || {};

export const selectMonthStats = (state, monthStr) =>
  state[selectMonthStatsQuery][monthStr] || {};

export const selectMonthDays = (state, monthStr) =>
  state[selectMonthDaysQuery][monthStr] || {};

export const selectMonthTransactions = (state, monthStr) =>
  state[selectMonthTransactionsQuery][monthStr] || {};

export const selectDayStats = (state, dayStr) =>
  state[selectDayStatsQuery][dayStr] || {};

export const selectDayTransactions = (state, dayStr) =>
  state[selectDayTransactionsQuery][dayStr] || {};

export const selectTransaction = (state, id) =>
  state[selectTransactionQuery][id] || {};

export const selectAllTags = state => state[selectAllTagsQuery] || {};

export const selectAllTransactionsByMonthByDay = createSelector(
  selectAllTransactions,
  transactions =>
    transactions.reduce(
      (accumulator, transaction) => {
        const { monthStr, dayStr } = getDateStrings(transaction.date);

        const { income, expense } = getIncomeExpense(transaction);

        // Optimally compute total, month and day stats
        const {
          byMonth,
          income: totalIncome,
          expense: totalExpense
        } = accumulator;

        const { income: monthIncome, expense: monthExpense, byDay } = byMonth[
          monthStr
        ] || {
          income: 0,
          expense: 0,
          byDay: {}
        };

        const {
          income: dayIncome,
          expense: dayExpense,
          transactions: dayTransactions
        } = byDay[dayStr] || {
          income: 0,
          expense: 0,
          transactions: []
        };

        return {
          income: totalIncome + income,
          expense: totalExpense + expense,
          byMonth: {
            ...byMonth,
            [monthStr]: {
              income: monthIncome + income,
              expense: monthExpense + expense,
              byDay: {
                ...byDay,
                [dayStr]: {
                  income: dayIncome + income,
                  expense: dayExpense + expense,
                  transactions: [
                    // No sorting because they already come sorted
                    ...dayTransactions,
                    transaction
                  ]
                }
              }
            }
          }
        };
      },
      { income: 0, expense: 0, byMonth: {} }
    )
);

export const selectAllTransactionsByMonthByDayPropType = PropTypes.shape({
  income: PropTypes.number.isRequired,
  expense: PropTypes.number.isRequired,
  byMonth: PropTypes.objectOf(
    PropTypes.shape({
      income: PropTypes.number.isRequired,
      expense: PropTypes.number.isRequired,
      byDay: PropTypes.objectOf(
        PropTypes.shape({
          income: PropTypes.number.isRequired,
          expense: PropTypes.number.isRequired,
          transactions: PropTypes.arrayOf(transactionPropType).isRequired
        })
      ).isRequired
    })
  ).isRequired
});

export const selectTotal = createSelector(
  selectAllTransactions,
  transactions => getTotal(transactions)
);

export const oldSelectAllTags = createSelector(
  selectAllTransactions,
  transactions =>
    uniques(flatten(transactions.map(transaction => transaction.tags || [])))
);
