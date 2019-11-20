import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { dbApiStoreKey, makeStoreKey } from "../redux/reducers";
import { setFetching, setFetched } from "../redux/actions";
import {
  dbApiFetchMonths,
  dbApiFetchDays,
  dbApiFetchTransactions
} from "../database/actions";

export const fetchMonthsQueryName = "FETCH_MONTHS";
export const fetchDaysQueryName = "FETCH_DAYS";
export const fetchTransactionsQueryName = "FETCH_TRANSACTIONS";

const dbActions = {
  [fetchMonthsQueryName]: dbApiFetchMonths,
  [fetchDaysQueryName]: dbApiFetchDays,
  [fetchTransactionsQueryName]: dbApiFetchTransactions
};

export const useDBApi = (query, { variables = {}, skip = false } = {}) => {
  // Mapping the whole store leads to performance issues
  // TODO: only map query to props
  const store = useSelector(state => state);
  const dispatch = useDispatch();

  const [hasFetched, setHasFetched] = useState(false);

  const data = store[dbApiStoreKey][makeStoreKey(query, variables)] || {};

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

export const DBApi = ({ children, name, query, ...rest }) => {
  // eslint-disable-next-line no-console
  console.warn('DBApi is deprecated. Use the hook "withDBApi"');
  const data = useDBApi(query, { ...rest });

  return children({ [name]: data });
};

export const withDBApi = (query, options = () => ({})) => Target => props => (
  <DBApi query={query} {...options(props)}>
    {queryProps => <Target {...props} {...queryProps} />}
  </DBApi>
);
