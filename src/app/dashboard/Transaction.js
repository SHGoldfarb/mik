import React from "react";
import { transactionPropType } from "../../utils/propTypes";

const Transaction = ({ transaction }) => (
  <div>{JSON.stringify(transaction)}</div>
);

Transaction.propTypes = {
  transaction: transactionPropType.isRequired
};

export default Transaction;
