import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { prettyCurrency } from "../../utils";
import { Transaction } from "./transactions";
import { selectAllTransactions, selectTotal } from "../../redux/selectors";
import style from "./Transactions.module.css";
import { transactionPropType } from "../../utils/propTypes";

const Transactions = ({ total, transactions, history }) => (
  <Fragment>
    <div className={style.total}>{prettyCurrency(total)}</div>
    <div className={style.transactionsContainer}>
      {transactions.map(transaction => (
        <Transaction
          transaction={transaction}
          key={transaction.id}
          onClick={() => history.push(`/form?id=${transaction.id}`)}
        />
      ))}
    </div>
  </Fragment>
);

const mapStateToProps = state => ({
  transactions: selectAllTransactions(state),
  total: selectTotal(state)
});

Transactions.propTypes = {
  transactions: PropTypes.arrayOf(transactionPropType).isRequired,
  total: PropTypes.number.isRequired,
  history: PropTypes.shape({ push: PropTypes.func.isRequired }).isRequired
};

export default connect(mapStateToProps)(Transactions);
