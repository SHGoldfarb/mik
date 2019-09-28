import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

// WARNING: the behaviour of this component is undefined if the length of fetchActions varies

class UnconnectedFetch extends Component {
  componentDidMount = () => {
    const { fetchActions, dispatch } = this.props;
    fetchActions.forEach(action => action && action(dispatch));
  };

  componentDidUpdate = ({ fetchActions: prevFetchActions }) => {
    const { fetchActions, dispatch } = this.props;
    fetchActions.forEach((action, index) => {
      if (action && !prevFetchActions[index]) {
        action(dispatch);
      }
    });
  };

  render = () => {
    const { children } = this.props;
    return children;
  };
}

UnconnectedFetch.propTypes = {
  fetchActions: PropTypes.arrayOf(
    PropTypes.oneOfType([PropTypes.func, PropTypes.bool])
  ).isRequired,
  children: PropTypes.node.isRequired,
  dispatch: PropTypes.func.isRequired
};

const Fetch = connect(state => ({ storeState: state }))(UnconnectedFetch);

export const withFetch = fetchActionsCreator => Target => props => (
  <Fetch fetchActions={fetchActionsCreator(props)}>
    <Target {...props} />
  </Fetch>
);

export default Fetch;
