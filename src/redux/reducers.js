import { SET_TRANSACTIONS, ADD_TRANSACTION } from "./actionTypes";
import { CASH } from "../utils/constants";

const createTransaction = ({ amount, type, comment = "comment" }) => ({
  amount,
  date: new Date().getTime(),
  account: CASH,
  type,
  comment
});

const getId = object => {
  let exists = true;
  const newId = Math.random().toString();
  while (exists) {
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

    default:
      return state;
  }
};
