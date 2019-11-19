import React, { useState } from "react";
import { connect } from "react-redux";
import { dbApiStoreKey, makeStoreKey } from "../redux/reducers";
import { setFetching, setFetched } from "../redux/actions";
import { dbApiFetchMonths, dbApiFetchDays } from "../database/actions";

export const fetchMonthsQueryName = "FETCH_MONTHS";
export const fetchDaysQueryName = "FETCH_DAYS";

const dbActions = {
  [fetchMonthsQueryName]: dbApiFetchMonths,
  [fetchDaysQueryName]: dbApiFetchDays
};

const UnconnectedDBApi = ({
  query,
  children,
  store,
  dispatch,
  name,
  variables = {},
  skip = false
}) => {
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

  return children({ [name]: data });
};

// Mapping the whole store leads to performance issues
// TODO: only map query to props
const mapStateToProps = state => ({ store: state });

export const DBApi = connect(mapStateToProps)(UnconnectedDBApi);

export const withDBApi = (query, options = () => ({})) => Target => props => (
  <DBApi query={query} {...options(props)}>
    {queryProps => <Target {...props} {...queryProps} />}
  </DBApi>
);
