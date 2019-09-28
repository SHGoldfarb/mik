import React from "react";
import PropTypes from "prop-types";
import style from "./IncomeExpense.module.scss";
import { prettyCurrency, classnames } from "../utils";

const IncomeExpense = ({ income, expense, className }) => (
  <div className={classnames(style.container, className)}>
    {income !== null && (
      <div className={style.income}>{prettyCurrency(income)}</div>
    )}
    {expense !== null && (
      <div className={style.expense}>{prettyCurrency(expense)}</div>
    )}
  </div>
);

IncomeExpense.defaultProps = {
  className: "",
  income: null,
  expense: null
};

IncomeExpense.propTypes = {
  income: PropTypes.number,
  expense: PropTypes.number,
  className: PropTypes.string
};

export default IncomeExpense;
