import React from "react";
import { number, string, bool } from "prop-types";
import PrettyDate from "../../../../components/PrettyDate";
import IncomeExpense from "../../../../components/IncomeExpense";
import Spinner from "../../../../components/Spinner";
import { classnames } from "../../../../utils";
import style from "./CardHeader.module.css";
import { numberOrString } from "../../../../utils/validators";

const CardHeader = ({
  income,
  expense,
  dateHighlight,
  dateNormal,
  numbersLoading,
  className
}) => (
  <div className={classnames(style.header, className)}>
    <PrettyDate dateHighlight={dateHighlight} dateNormal={dateNormal} />
    {numbersLoading ? (
      <Spinner />
    ) : (
      <IncomeExpense
        income={income}
        expense={expense}
        className={style.incomeExpense}
      />
    )}
  </div>
);

CardHeader.defaultProps = {
  income: 0,
  expense: 0,
  dateHighlight: "",
  dateNormal: "",
  numbersLoading: false,
  className: ""
};

CardHeader.propTypes = {
  income: number,
  expense: number,
  dateHighlight: numberOrString,
  dateNormal: numberOrString,
  numbersLoading: bool,
  className: string
};

export default CardHeader;
