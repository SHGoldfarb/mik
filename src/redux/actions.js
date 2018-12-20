import { SET_TRANSACTIONS, ADD_TRANSACTION } from "./actionTypes";

// eslint-disable-next-line import/prefer-default-export
export const setTransactions = transactions => ({
  type: SET_TRANSACTIONS,
  payload: transactions
});

export const addTransaction = transaction => ({
  type: ADD_TRANSACTION,
  payload: transaction
});
