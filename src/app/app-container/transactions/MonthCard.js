import React from "react";
import PropTypes, { shape, number } from "prop-types";
import Card from "../../../components/Card";
import IncomeExpense from "../../../components/IncomeExpense";
import { inCurrentTZ } from "../../../utils/date";
import PrettyDate from "../../../components/PrettyDate";
import I18N from "../../../config/I18N";
import style from "./MonthCard.module.scss";
import Spinner from "../../../components/Spinner";
import { fetchDaysQueryName, useDBApi } from "../../../components/DBApi";

const MonthCard = ({ monthStr, children, active, onClick, stats }) => {
  const daysData = useDBApi(fetchDaysQueryName, {
    variables: { monthStr },
    skip: !active
  });

  const days = daysData.loading || !daysData.data ? [] : daysData.data;

  const date = inCurrentTZ(monthStr);
  const { income, expense } = stats;

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
      onHeaderClick={onClick}
    >
      {(active && (daysData.loading ? <Spinner /> : children(days))) || null}
    </Card>
  );
};

MonthCard.defaultProps = {};

MonthCard.propTypes = {
  monthStr: PropTypes.string.isRequired,
  children: PropTypes.func.isRequired,
  active: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
  stats: shape({ income: number, expense: number }).isRequired
};

export default MonthCard;
