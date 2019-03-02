import {
  SET_TRANSACTIONS,
  ADD_TRANSACTION,
  DELETE_TRANSACTION,
  CREATE_OR_UPDATE_TRANSACTION
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
