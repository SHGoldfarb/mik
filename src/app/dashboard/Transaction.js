import React from "react";
import { transactionPropType } from "../../utils/propTypes";

const Transaction = ({ transaction }) => {
  const { amount, date, account, type, comment } = transaction;
  return (
    <div>
      <div>{comment}</div>
      <div>{amount}</div>
      <div>{new Date(date).toLocaleString()}</div>
    </div>
  );
};

Transaction.propTypes = {
  transaction: transactionPropType.isRequired
};

export default Transaction;
