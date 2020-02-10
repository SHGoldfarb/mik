import { SET_FETCHING, SET_FETCHED, SET_ALL_CLEARED } from "./actionTypes";

export const setFetching = (query, variables) => ({
  type: SET_FETCHING,
  payload: { query, variables }
});

export const setFetched = (query, variables, data) => ({
  type: SET_FETCHED,
  payload: { query, variables, data }
});

export const setAllCleared = () => ({
  type: SET_ALL_CLEARED
});
