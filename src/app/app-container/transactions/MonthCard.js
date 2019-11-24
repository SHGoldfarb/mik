import React from "react";
import PropTypes, { shape, number } from "prop-types";
import Card from "../../../components/Card";
import { inCurrentTZ } from "../../../utils/date";
import I18N from "../../../config/I18N";
import style from "./MonthCard.module.scss";
import Spinner from "../../../components/Spinner";
import { fetchDaysQueryName, useDBApi } from "../../../components/DBApi";
import CardHeader from "./components/CardHeader";

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
      header={
        <CardHeader
          dateHighlight={I18N.date.months[date.getMonth()]}
          dateNormal={date.getFullYear()}
          income={income}
          expense={expense}
          className={style.header}
        />
      }
      className={style.cardBackground}
      onHeaderClick={onClick}
      theme={{ header: style.headerContainer }}
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
