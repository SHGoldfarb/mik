import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { dbApiStoreKey, makeStoreKey } from "../redux/reducers";
import { setFetching, setFetched } from "../redux/actions";
import { dbApiFetchMonths, dbApiFetchDays } from "../database/actions";

export const fetchMonthsQueryName = "FETCH_MONTHS";
export const fetchDaysQueryName = "FETCH_DAYS";

const dbActions = {
  [fetchMonthsQueryName]: dbApiFetchMonths,
  [fetchDaysQueryName]: dbApiFetchDays
};

const useDBApi = (query, { variables = {}, skip = false } = {}) => {
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

const DBApi = ({ children, name, query, ...rest }) => {
  const data = useDBApi(query, { ...rest });

  return children({ [name]: data });
};

export const withDBApi = (query, options = () => ({})) => Target => props => (
  <DBApi query={query} {...options(props)}>
    {queryProps => <Target {...props} {...queryProps} />}
  </DBApi>
);
