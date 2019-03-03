import { createSelector } from "reselect";
import { INCOME, EXPENSE } from "../utils/constants";
import flatten from "../utils/flatten";

const parseTransaction = ({ amount, ...rest }) => ({
  amount: amount || 0,
  ...rest
});

export const selectTransaction = (state, id) =>
  state.transactions && state.transactions[id]
    ? { ...parseTransaction(state.transactions[id]), id }
    : null;

export const selectAllTransactions = state =>
  state.transactions
    ? Object.keys(state.transactions)
        .map(id => ({ ...parseTransaction(state.transactions[id]), id }))
        .sort((a, b) => -a.date + b.date)
    : [];

export const selectTotal = createSelector(
  selectAllTransactions,
  transactions =>
    transactions.reduce((total, transaction) => {
      const { amount, type } = transaction;
      switch (type) {
        case INCOME:
          return total + amount;
        case EXPENSE:
          return total - amount;
        default:
          throw Error(`Unsupported transaction type ${type}`);
      }
    }, 0)
);

export const selectAllTags = createSelector(
  selectAllTransactions,
  transactions =>
    flatten(transactions.map(transaction => transaction.tags || []))
);
