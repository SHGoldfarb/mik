import React, { Component } from "react";
import "./App.scss";
import { AppContainer } from "./app";
import { dbSetTransactionsIfNone } from "./database/actions";
import { generateTransactionsArray } from "./app/mockData";
import Spinner from "./components/Spinner";

const initialTransactionsNumber = 5000;

const saveInitialTransactions = () =>
  dbSetTransactionsIfNone(() =>
    generateTransactionsArray(initialTransactionsNumber)
  );
class App extends Component {
  state = { loading: true };

  componentDidMount = async () => {
    await saveInitialTransactions();
    this.setState({ loading: false });
  };

  render() {
    const { loading } = this.state;
    return loading ? <Spinner /> : <AppContainer />;
  }
}

App.propTypes = {};

export default App;
