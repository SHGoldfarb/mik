import React, { Component } from "react";
import Dashboard from "./app/Dashboard";
import mockData from "./app/mockData";
import "./App.css";

const initialTransactionsNumber = 5;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { transactions: mockData(initialTransactionsNumber) };
  }

  render() {
    const { transactions } = this.state;
    return <Dashboard transactions={transactions} />;
  }
}

export default App;
