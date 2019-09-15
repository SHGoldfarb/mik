import React from "react";
import PropTypes from "prop-types";
import Card from "../../../components/Card";
import IncomeExpense from "../../../components/IncomeExpense";
import { inCurrentTZ, prettyMonth } from "../../../utils/date";

const MonthCard = ({ monthStr, children, income, expense }) => (
  <Card
    leftHeader={prettyMonth(inCurrentTZ(monthStr))}
    header={<IncomeExpense income={income} expense={expense} />}
  >
    {children}
  </Card>
);

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
