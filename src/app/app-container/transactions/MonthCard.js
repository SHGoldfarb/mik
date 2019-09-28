import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Card from "../../../components/Card";
import IncomeExpense from "../../../components/IncomeExpense";
import { inCurrentTZ } from "../../../utils/date";
import PrettyDate from "../../../components/PrettyDate";
import I18N from "../../../config/I18N";
import style from "./MonthCard.module.scss";
import { dataPropType } from "../../../utils/propTypes";
import Spinner from "../../../components/Spinner";
import { selectMonthStats, selectMonthDays } from "../../../redux/selectors";
import { compose } from "../../../utils";
import { withFetch } from "../../../components/Fetch";
import { fetchMonthStats, fetchMonthDays } from "../../../redux/actionCreators";

const MonthCard = ({ monthStr, children, statsData, daysData, active }) => {
  const days = daysData.loading || !daysData.data ? [] : daysData.data;

  const date = inCurrentTZ(monthStr);
  const { income, expense } =
    statsData.loading || !statsData.data
      ? { income: null, expense: null }
      : statsData.data;
  return (
    <Card
      leftHeader={
        <PrettyDate
          dateHighlight={I18N.date.months[date.getMonth()]}
          dateNormal={date.getFullYear()}
        />
      }
      header={
        statsData.loading ? (
          <Spinner />
        ) : (
          <IncomeExpense
            income={income}
            expense={expense}
            className={style.incomeExpense}
          />
        )
      }
      className={style.cardBackground}
    >
      {(active && (daysData.loading ? <Spinner /> : children(days))) || null}
    </Card>
  );
};

const mapStateToProps = (state, { monthStr }) => ({
  statsData: selectMonthStats(state, monthStr),
  daysData: selectMonthDays(state, monthStr)
});

MonthCard.defaultProps = {};

MonthCard.propTypes = {
  monthStr: PropTypes.string.isRequired,
  children: PropTypes.func.isRequired,
  statsData: dataPropType(
    PropTypes.shape({ income: PropTypes.number, expense: PropTypes.number })
  ).isRequired,
  daysData: dataPropType(PropTypes.arrayOf(PropTypes.string)).isRequired,
  active: PropTypes.bool.isRequired
};

export default compose(
  connect(mapStateToProps),
  withFetch(({ monthStr, active, statsData, daysData }) => [
    !statsData.loaded && fetchMonthStats(monthStr),
    !daysData.loaded && active && fetchMonthDays(monthStr)
  ])
)(MonthCard);
