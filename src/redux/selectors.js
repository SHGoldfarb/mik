import { createSelector } from "reselect";
import flatten from "../utils/flatten";
import uniques from "../utils/uniques";
import { getTotal, getIncomeExpense } from "../utils/stats";

const parseTransaction = ({ amount, tags, ...rest }) => ({
  amount: amount || 0,
  tags: tags || [],
  ...rest
});

export const selectTransaction = (state, id) =>
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

const getDateStrings = date => {
  const dateObject = new Date(date);
  const day = dateObject.getDate();
  const month = dateObject.getMonth() + 1;
  const year = dateObject.getFullYear();
  const monthStr = `${year}-${month}`;
  const dayStr = `${monthStr}-${day}`;
  return { monthStr, dayStr };
};

export const selectAllMonths = createSelector(
  selectAllTransactionsUnordered,
  transactions => [
    ...transactions.reduce((acc, transaction) => {
      const { monthStr } = getDateStrings(transaction.date);
      return acc.add(monthStr);
    }, new Set())
  ]
);

// Returns transactions in a dictionary with shape: (TODO: update)
// {
//   [monthStr]: {
//     [day]: [transactions]
//   }
// }
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

export const selectTotal = createSelector(
  selectAllTransactions,
  transactions => getTotal(transactions)
);

export const selectAllTags = createSelector(
  selectAllTransactions,
  transactions =>
    uniques(flatten(transactions.map(transaction => transaction.tags || [])))
);
