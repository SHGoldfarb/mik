import React from "react";
import PropTypes from "prop-types";
import Card from "../../../components/Card";
import IncomeExpense from "../../../components/IncomeExpense";
import { inCurrentTZ } from "../../../utils/date";
import PrettyDate from "../../../components/PrettyDate";
import I18N from "../../../config/I18N";
import Spinner from "../../../components/Spinner";
import {
  useDBApi,
  fetchTransactionsQueryName
} from "../../../components/DBApi";
import { getIncomeExpenses } from "../../../utils/stats";

const DayCard = ({ dayStr, children }) => {
  const { loading, data: transactions = [] } = useDBApi(
    fetchTransactionsQueryName,
    {
      variables: { dayStr }
    }
  );

  const { income, expense } = loading
    ? { income: null, expense: null }
    : getIncomeExpenses(transactions);

  const date = inCurrentTZ(dayStr);
  return (
    <Card
      leftHeader={
        <PrettyDate
          dateHighlight={date.getDate()}
          dateNormal={I18N.date.days[date.getDay()]}
        />
      }
      header={
        loading ? (
          <Spinner />
        ) : (
          <IncomeExpense income={income} expense={expense} />
        )
      }
    >
      {loading ? <Spinner /> : children(transactions)}
    </Card>
  );
};

DayCard.defaultProps = {};

DayCard.propTypes = {
  dayStr: PropTypes.string.isRequired,
  children: PropTypes.func.isRequired
};

export default DayCard;
