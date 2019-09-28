import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

class UnconnectedFetch extends Component {
  componentDidMount = () => {
    const { fetchActions, dispatch } = this.props;
    fetchActions.forEach(action => action(dispatch));
  };

  render = () => {
    const { children } = this.props;
    return children;
  };
}

UnconnectedFetch.propTypes = {
  fetchActions: PropTypes.arrayOf(PropTypes.func).isRequired,
  children: PropTypes.node.isRequired,
  dispatch: PropTypes.func.isRequired
};

const Fetch = connect()(UnconnectedFetch);

export const withFetch = fetchActionsCreator => Target => props => (
  <Fetch fetchActions={fetchActionsCreator(props)}>
    <Target {...props} />
  </Fetch>
);

export default Fetch;
