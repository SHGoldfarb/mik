import { SET_FETCHING, SET_FETCHED } from "./actionTypes";

export const setFetching = (query, variables) => ({
  type: SET_FETCHING,
  payload: { query, variables }
});

export const setFetched = (query, variables, data) => ({
  type: SET_FETCHED,
  payload: { query, variables, data }
});
