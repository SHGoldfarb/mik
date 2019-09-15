import React from "react";
import PropTypes from "prop-types";
import Card from "../../../components/Card";
import IncomeExpense from "../../../components/IncomeExpense";

const DayCard = ({ dayStr, children, income, expense }) => (
  <Card
    leftHeader={dayStr}
    header={<IncomeExpense income={income} expense={expense} />}
  >
    {children}
  </Card>
);

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
