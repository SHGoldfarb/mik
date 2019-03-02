import {
  SET_TRANSACTIONS,
  ADD_TRANSACTION,
  DELETE_TRANSACTION
} from "./actionTypes";
import { CASH } from "../utils/constants";

const createTransaction = ({
  amount,
  type,
  comment = "comment",
  date = new Date().getTime()
}) => ({
  amount,
  date: new Date(date).getTime(),
  account: CASH,
  type,
  comment
});

const getId = object => {
  let exists = true;
  let newId;
  while (exists) {
    newId = Math.random().toString();
    exists = object[newId];
  }
  return newId;
};

// eslint-disable-next-line import/prefer-default-export
export const rootReducer = (state = {}, action) => {
  const { type, payload } = action;
  switch (type) {
    case SET_TRANSACTIONS:
      return {
        ...state,
        transactions: payload
      };
    case ADD_TRANSACTION: {
      const newTransaction = createTransaction(payload);
      const newId = getId(state.transactions);
      return {
        ...state,
        transactions: { ...state.transactions, [newId]: newTransaction }
      };
    }
    case DELETE_TRANSACTION: {
      const { transactions } = state;
      delete transactions[payload];
      return { ...state, transactions };
    }
    default:
      return state;
  }
};
