import { SET_TRANSACTIONS } from "./actionTypes";

// eslint-disable-next-line import/prefer-default-export
export const setTransactions = transactions => ({
  type: SET_TRANSACTIONS,
  payload: transactions
});
