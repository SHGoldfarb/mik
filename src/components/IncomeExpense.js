import React from "react";
import PropTypes from "prop-types";
import style from "./IncomeExpense.module.scss";
import { prettyCurrency, classnames } from "../utils";

const IncomeExpense = ({ income, expense, className }) => (
  <div className={classnames(style.container, className)}>
    <div className={style.income}>{prettyCurrency(income)}</div>
    <div className={style.expense}>{prettyCurrency(expense)}</div>
  </div>
);

IncomeExpense.defaultProps = {
  className: ""
};

IncomeExpense.propTypes = {
  income: PropTypes.number.isRequired,
  expense: PropTypes.number.isRequired,
  className: PropTypes.string
};

export default IncomeExpense;
