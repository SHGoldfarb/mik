import { createSelector } from "reselect";
import { dbApiStoreKey, makeStoreKey } from "./reducers";

export const selectDBApiStore = state => state[dbApiStoreKey];

export const getQueryFromStore = (query, variables) => dbApiStore =>
  dbApiStore[makeStoreKey(query, variables)];

export const selectDBApiQuery = (query, variables) =>
  createSelector(
    selectDBApiStore,
    getQueryFromStore(query, variables)
  );
