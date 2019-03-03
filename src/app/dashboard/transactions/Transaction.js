import React from "react";
import PropTypes from "prop-types";
import { transactionPropType } from "../../../utils/propTypes";
import { classnames, prettyCurrency } from "../../../utils";
import { EXPENSE } from "../../../utils/constants";
import Clickable from "../../../components/Clickable";
import style from "./Transaction.module.css";

const Transaction = ({ transaction, onClick }) => {
  const { amount, date, type, comment } = transaction;
  const dateStr = new Date(date).toLocaleString();

  return (
    <Clickable className={style.transactionContainer} onClick={onClick}>
      <div className={style.dateContainer}>{dateStr}</div>
      <div className={style.commentAmountContainer}>
        <div className={style.commentContainer}>{comment}</div>
        <div
          className={classnames(
            style.amountContainer,
            type === EXPENSE ? style.expense : style.income
          )}
        >
          {prettyCurrency(amount)}
        </div>
      </div>
    </Clickable>
  );
};

Transaction.propTypes = {
  transaction: transactionPropType.isRequired,

  onClick: PropTypes.func.isRequired
};

export default Transaction;
