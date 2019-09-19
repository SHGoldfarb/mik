import React from "react";
import PropTypes from "prop-types";
import Card from "../../../components/Card";
import IncomeExpense from "../../../components/IncomeExpense";
import { inCurrentTZ } from "../../../utils/date";
import PrettyDate from "../../../components/PrettyDate";
import I18N from "../../../config/I18N";
import style from "./MonthCard.module.scss";

const MonthCard = ({ monthStr, children, income, expense }) => {
  const date = inCurrentTZ(monthStr);
  return (
    <Card
      leftHeader={
        <PrettyDate
          dateHighlight={I18N.date.months[date.getMonth()]}
          dateNormal={date.getFullYear()}
        />
      }
      header={
        <IncomeExpense
          income={income}
          expense={expense}
          className={style.incomeExpense}
        />
      }
      className={style.cardBackground}
    >
      {children}
    </Card>
  );
};

MonthCard.defaultProps = {
  children: null
};

MonthCard.propTypes = {
  monthStr: PropTypes.string.isRequired,
  children: PropTypes.node,
  income: PropTypes.number.isRequired,
  expense: PropTypes.number.isRequired
};

export default MonthCard;
