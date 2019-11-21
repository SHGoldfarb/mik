import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { dbApiStoreKey, makeStoreKey } from "../redux/reducers";
import { setFetching, setFetched } from "../redux/actions";
import {
  dbApiFetchMonths,
  dbApiFetchDays,
  dbApiFetchTransactions,
  dbApiFetchTransaction,
  dbApiFetchTags,
  dbApiUpsertTransaction,
  dbApiDeleteTransaction
} from "../database/actions";

export const fetchMonthsQueryName = "FETCH_MONTHS";
export const fetchDaysQueryName = "FETCH_DAYS";
export const fetchTransactionsQueryName = "FETCH_TRANSACTIONS";
export const fetchTransactionQueryName = "FETCH_TRANSACTION";
export const fetchTagsQueryName = "FETCH_TAGS";
export const upsertTransactionMutationName = "UPSERT_TRANSACTION_MUTATION";
export const deleteTransactionMutationName = "DELETE_TRANSACTION_MUTATION";

const dbQuerys = {
  [fetchMonthsQueryName]: dbApiFetchMonths,
  [fetchDaysQueryName]: dbApiFetchDays,
  [fetchTransactionsQueryName]: dbApiFetchTransactions,
  [fetchTransactionQueryName]: dbApiFetchTransaction,
  [fetchTagsQueryName]: dbApiFetchTags
};

const dbMutations = {
  [upsertTransactionMutationName]: dbApiUpsertTransaction,
  [deleteTransactionMutationName]: dbApiDeleteTransaction
};

const useDBApiQuery = (query, { variables = {}, skip = false } = {}) => {
  // Use hooks unconditionally

  const data =
    useSelector(
      state => state[dbApiStoreKey][makeStoreKey(query, variables)]
    ) || {};

  const dispatch = useDispatch();

  const [hasFetched, setHasFetched] = useState(false);

  // Return if query is a mutation

  if (!Object.keys(dbQuerys).includes(query)) {
    return undefined;
  }

  const { fetched } = data;

  if (!fetched && !hasFetched && !skip) {
    dispatch(setFetching(query, variables));
    setHasFetched(true);
    (async () => {
      const fetchedData = await dbQuerys[query](variables);
      dispatch(setFetched(query, variables, fetchedData));
    })();
  }

  return data;
};

const useDBApiMutation = query => {
  if (!Object.keys(dbMutations).includes(query)) {
    return undefined;
  }
  const mutate = ({ variables = {} } = {}) =>
    // Should return a promise that resolves to the mutated object once
    // the transaction is complete.
    dbMutations[query](variables);
  return mutate;
};

export const useDBApi = (...args) => {
  const queryData = useDBApiQuery(...args);
  const mutationData = useDBApiMutation(...args);
  return queryData || mutationData;
};

const defaultDataPropName = "data";

export const withDBApi = (
  query,
  optionsFunction = () => ({})
) => Target => props => {
  const { name = defaultDataPropName, ...options } = optionsFunction(props);
  const data = useDBApi(query, options);
  return <Target {...{ ...props, [name]: data }} />;
};
