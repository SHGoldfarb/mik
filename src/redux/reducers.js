import { combineReducers } from "redux";
import { SET_FETCHING, SET_FETCHED } from "./actionTypes";

export const makeStoreKey = (query, variables) =>
  `${query} ${JSON.stringify(variables)}`;

const dbApiReducer = (state = {}, action) => {
  const { type, payload } = action;
  switch (type) {
    case SET_FETCHING: {
      const { query, variables } = payload;
      return {
        ...state,
        [makeStoreKey(query, variables)]: { loading: true, fetched: true }
      };
    }
    case SET_FETCHED: {
      const { query, variables, data } = payload;
      return {
        ...state,
        [makeStoreKey(query, variables)]: {
          loading: false,
          fetched: true,
          data
        }
      };
    }
    default:
      return state;
  }
};

export const dbApiStoreKey = "dbApiStoreKey";

export const rootReducer = combineReducers({
  [dbApiStoreKey]: dbApiReducer
});
