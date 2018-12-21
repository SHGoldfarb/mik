import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { deleteTransaction } from "../../redux/actions";
import { transactionPropType } from "../../utils/propTypes";
import { classnames, toMoneyString } from "../../utils";
import { EXPENSE } from "../../utils/constants";
import { Button } from "../../components";
import style from "./Transaction.module.css";

const Transaction = ({ transaction, onDeleteTransaction }) => {
  const { amount, date, type, comment } = transaction;
  const dateStr = new Date(date).toLocaleString();
  const handleDeleteTransaction = () => {
    onDeleteTransaction(transaction.id);
  };
  return (
    <div className={style.transactionContainer}>
      <div className={style.dateContainer}>
        {dateStr}
        <Button
          onClick={handleDeleteTransaction}
          className={style.deleteButton}
        >
          Eliminar
        </Button>
      </div>
      <div className={style.commentAmountContainer}>
        <div className={style.commentContainer}>{comment}</div>
        <div
          className={classnames(
            style.amountContainer,
            type === EXPENSE ? style.expense : style.income
          )}
        >
          {toMoneyString(amount)}
        </div>
      </div>
    </div>
  );
};

Transaction.propTypes = {
  transaction: transactionPropType.isRequired,
  onDeleteTransaction: PropTypes.func.isRequired
};

const mapDispatchToProps = dispatch => ({
  onDeleteTransaction: id => dispatch(deleteTransaction(id))
});

export default connect(
  () => ({}),
  mapDispatchToProps
)(Transaction);
