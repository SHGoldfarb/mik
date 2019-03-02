import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { prettyCurrency } from "../../utils";
import { Transaction } from "./transactions";
import { selectAllTransactions, selectTotal } from "../../redux/selectors";
import style from "./Transactions.module.css";

const Transactions = ({ total, transactions }) => (
  <Fragment>
    <div className={style.total}>{prettyCurrency(total)}</div>
    <div className={style.transactionsContainer}>
      {transactions.map(transaction => (
        <Transaction transaction={transaction} key={transaction.id} />
      ))}
    </div>
  </Fragment>
);

const mapStateToProps = state => ({
  transactions: selectAllTransactions(state),
  total: selectTotal(state)
});

Transactions.propTypes = {
  transactions: PropTypes.arrayOf(
    PropTypes.shape({
      amount: PropTypes.number.isRequired,
      date: PropTypes.number.isRequired,
      account: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired
    })
  ).isRequired,
  total: PropTypes.number.isRequired
};

export default connect(mapStateToProps)(Transactions);
