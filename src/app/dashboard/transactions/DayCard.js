import React from "react";
import PropTypes from "prop-types";
import Card from "../../../components/Card";
import IncomeExpense from "../../../components/IncomeExpense";
import { inCurrentTZ } from "../../../utils/date";
import PrettyDate from "../../../components/PrettyDate";
import I18N from "../../../config/I18N";

const DayCard = ({ dayStr, children, income, expense }) => {
  const date = inCurrentTZ(dayStr);
  return (
    <Card
      leftHeader={
        <PrettyDate
          dateHighlight={date.getDate()}
          dateNormal={I18N.date.days[date.getDay()]}
        />
      }
      header={<IncomeExpense income={income} expense={expense} />}
    >
      {children}
    </Card>
  );
};

DayCard.defaultProps = {
  children: null
};

DayCard.propTypes = {
  dayStr: PropTypes.string.isRequired,
  children: PropTypes.node,
  income: PropTypes.number.isRequired,
  expense: PropTypes.number.isRequired
};

export default DayCard;
