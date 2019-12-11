import React from "react";
import Input from "../../../components/inputs/Input";
import { I18N } from "../../../config";

const AmountInput = ({ ...props }) => (
  <Input
    label={`${I18N.transaction.amount}:`}
    type="number"
    {...props}
    autoFocus
  />
);

export default AmountInput;
