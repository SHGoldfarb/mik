import React from "react";
import PropTypes from "prop-types";
import Card from "../../../components/Card";
import { inCurrentTZ } from "../../../utils/date";
import I18N from "../../../config/I18N";
import Spinner from "../../../components/Spinner";
import {
  useDBApi,
  fetchTransactionsQueryName
} from "../../../components/DBApi";
import { getIncomeExpenses } from "../../../utils/stats";
import CardHeader from "./components/CardHeader";
import style from "./DayCard.module.css";

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
      header={
        <CardHeader
          dateHighlight={date.getDate()}
          dateNormal={I18N.date.days[date.getDay()]}
          income={income}
          expense={expense}
          numbersLoading={loading}
          className={style.header}
        />
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
