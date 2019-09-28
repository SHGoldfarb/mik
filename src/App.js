import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import "./App.scss";
import { setTransactions } from "./redux/actions";
import { KEY } from "./utils/constants";
import { AppContainer } from "./app";
import { dbSetTransactions } from "./database/actions";
import generateTransactions, {
  generateTransactionsArray
} from "./app/mockData";
import Spinner from "./components/Spinner";

const initialTransactionsNumber = 5000;

const setInitialTransactions = setTransactionsAction => {
  const storeData = localStorage.getItem(KEY);
  if (storeData === null) {
    setTransactionsAction(generateTransactions(initialTransactionsNumber));
  } else {
    const { transactions } = JSON.parse(storeData);
    setTransactionsAction(transactions);
  }
};

const saveInitialTransactions = async () => {
  const data = generateTransactionsArray(initialTransactionsNumber);
  await dbSetTransactions(data);
};

class App extends Component {
  state = { loading: true };

  componentDidMount = async () => {
    const { writeTransactions } = this.props;
    setInitialTransactions(writeTransactions);
    await saveInitialTransactions();
    this.setState({ loading: false });
  };

  render() {
    const { loading } = this.state;
    return loading ? <Spinner /> : <AppContainer />;
  }
}

App.propTypes = {
  writeTransactions: PropTypes.func.isRequired
};

const mapDispatchToProps = dispatch => ({
  writeTransactions: transactions => dispatch(setTransactions(transactions))
});

export default connect(
  () => ({}),
  mapDispatchToProps
)(App);
