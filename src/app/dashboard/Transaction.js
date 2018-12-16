import React from "react";
import { transactionPropType } from "../../utils/propTypes";

const Transaction = ({ transaction }) => {
  const { amount, date, account, type } = transaction;
  return (
    <div>
      <div>{}</div>
      <div>{amount}</div>
      <div>{date}</div>
    </div>
  );
};

Transaction.propTypes = {
  transaction: transactionPropType.isRequired
};

export default Transaction;
