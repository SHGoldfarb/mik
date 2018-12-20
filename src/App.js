import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Dashboard from "./app/Dashboard";
import mockData from "./app/mockData";
import "./App.css";
import { setTransactions } from "./redux/actions";

const initialTransactionsNumber = 5;

class App extends Component {
  constructor(props) {
    super(props);
    props.setTransactions(mockData(initialTransactionsNumber));
  }

  render() {
    return <Dashboard />;
  }
}

App.propTypes = {
  setTransactions: PropTypes.func.isRequired
};

const mapDispatchToProps = dispatch => ({
  setTransactions: transactions => dispatch(setTransactions(transactions))
});

export default connect(
  () => ({}),
  mapDispatchToProps
)(App);
