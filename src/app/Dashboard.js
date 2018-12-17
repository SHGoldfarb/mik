import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Transaction from "./dashboard/Transaction";
import { selectAllTransactions } from "../redux/selectors";

const Dashboard = ({ transactions }) => (
  <div>
    {transactions.map(transaction => (
      <Transaction transaction={transaction} key={transaction.date} />
    ))}
  </div>
);

Dashboard.propTypes = {
  transactions: PropTypes.arrayOf(
    PropTypes.shape({
      amount: PropTypes.number.isRequired,
      date: PropTypes.number.isRequired,
      account: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired
    })
  ).isRequired
};

const mapStateToProps = state => ({
  transactions: selectAllTransactions(state)
});

export default connect(mapStateToProps)(Dashboard);
