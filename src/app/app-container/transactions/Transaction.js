import React from "react";
import PropTypes from "prop-types";
import { transactionPropType } from "../../../utils/propTypes";
import { classnames, prettyCurrency } from "../../../utils";
import { EXPENSE } from "../../../utils/constants";
import Clickable from "../../../components/Clickable";
import style from "./Transaction.module.scss";

const Transaction = ({ transaction, onClick }) => {
  const { amount, type, comment, tags } = transaction;

  return (
    <Clickable className={style.transactionContainer} onClick={onClick}>
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
      <div className={style.tagsContainer}>
        {tags.map(tag => (
          <div key={tag} className={style.tag}>
            {tag}
          </div>
        ))}
      </div>
    </Clickable>
  );
};

Transaction.propTypes = {
  transaction: transactionPropType.isRequired,

  onClick: PropTypes.func.isRequired
};

export default Transaction;
