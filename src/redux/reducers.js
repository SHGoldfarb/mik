import { SET_TRANSACTIONS } from "./actionTypes";

// eslint-disable-next-line import/prefer-default-export
export const rootReducer = (state = {}, action) => {
  switch (action.type) {
    case SET_TRANSACTIONS:
      return {
        ...state,
        transactions: action.payload
      };
    default:
      return state;
  }
};
