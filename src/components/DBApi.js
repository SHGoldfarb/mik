import React, { useState } from "react";
import { connect } from "react-redux";
import { dbApiStoreKey } from "../redux/reducers";
import { setFetching, setFetched } from "../redux/actions";
import { dbApiFetchMonths } from "../database/actions";

export const fetchMonthsQueryName = "FETCH_MONTHS";

const dbActions = {
  [fetchMonthsQueryName]: dbApiFetchMonths
};

const UnconnectedDBApi = ({ query, children, store, dispatch, name }) => {
  const [hasFetched, setHasFetched] = useState(false);

  const data = store[dbApiStoreKey][query] || {};

  const { fetched } = data;

  if (!fetched && !hasFetched) {
    dispatch(setFetching(query));
    setHasFetched(true);
    (async () => {
      const fetchedData = await dbActions[query]();
      dispatch(setFetched(fetchMonthsQueryName, fetchedData));
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
