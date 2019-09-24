import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import mockData from "./app/mockData";
import "./App.scss";
import { setTransactions } from "./redux/actions";
import { KEY } from "./utils/constants";
import { AppContainer } from "./app";

const initialTransactionsNumber = 5000;

const setInitialTransactions = setTransactionsAction => {
  const storeData = localStorage.getItem(KEY);
  if (storeData === null) {
    setTransactionsAction(mockData(initialTransactionsNumber));
  } else {
    const { transactions } = JSON.parse(storeData);
    setTransactionsAction(transactions);
  }
};

class App extends Component {
  constructor(props) {
    super(props);
    setInitialTransactions(props.setTransactions);
  }

  render() {
    return <AppContainer />;
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
