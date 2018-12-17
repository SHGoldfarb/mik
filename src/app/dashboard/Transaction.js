import React from "react";
import style from "./Transaction.module.css";
import { transactionPropType } from "../../utils/propTypes";
import { classnames, toMoneyString } from "../../utils";
import { EXPENSE } from "../../utils/constants";

const Transaction = ({ transaction }) => {
  const { amount, date, type, comment } = transaction;
  const dateStr = new Date(date).toLocaleString();
  return (
    <div className={style.transactionContainer}>
      <div className={style.dateContainer}>{dateStr}</div>
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
  transaction: transactionPropType.isRequired
};

export default Transaction;
