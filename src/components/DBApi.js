import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { dbApiStoreKey, makeStoreKey } from "../redux/reducers";
import { setFetching, setFetched } from "../redux/actions";
import {
  dbApiFetchMonths,
  dbApiFetchDays,
  dbApiFetchTransactions,
  dbApiFetchTransaction,
  dbApiFetchTags
} from "../database/actions";

export const fetchMonthsQueryName = "FETCH_MONTHS";
export const fetchDaysQueryName = "FETCH_DAYS";
export const fetchTransactionsQueryName = "FETCH_TRANSACTIONS";
export const fetchTransactionQueryName = "FETCH_TRANSACTION";
export const fetchTagsQueryName = "FETCH_TAGS";

const dbActions = {
  [fetchMonthsQueryName]: dbApiFetchMonths,
  [fetchDaysQueryName]: dbApiFetchDays,
  [fetchTransactionsQueryName]: dbApiFetchTransactions,
  [fetchTransactionQueryName]: dbApiFetchTransaction,
  [fetchTagsQueryName]: dbApiFetchTags
};

export const useDBApi = (query, { variables = {}, skip = false } = {}) => {
  const data =
    useSelector(
      state => state[dbApiStoreKey][makeStoreKey(query, variables)]
    ) || {};

  const dispatch = useDispatch();

  const [hasFetched, setHasFetched] = useState(false);

  const { fetched } = data;

  if (!fetched && !hasFetched && !skip) {
    dispatch(setFetching(query, variables));
    setHasFetched(true);
    (async () => {
      const fetchedData = await dbActions[query](variables);
      dispatch(setFetched(query, variables, fetchedData));
    })();
  }

  return data;
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
