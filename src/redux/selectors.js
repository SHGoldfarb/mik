import { createSelector } from "reselect";
import { INCOME, EXPENSE } from "../utils/constants";

export const selectAllTransactions = state =>
  state.transactions
    ? Object.values(state.transactions).sort((a, b) => -a.date + b.date)
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
          return total;
      }
    }, 0)
);
