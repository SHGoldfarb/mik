import React from "react";
import PropTypes, { shape, number } from "prop-types";
import { connect } from "react-redux";
import Card from "../../../components/Card";
import IncomeExpense from "../../../components/IncomeExpense";
import { inCurrentTZ } from "../../../utils/date";
import PrettyDate from "../../../components/PrettyDate";
import I18N from "../../../config/I18N";
import style from "./MonthCard.module.scss";
import { dataPropType } from "../../../utils/propTypes";
import Spinner from "../../../components/Spinner";
import { selectMonthDays } from "../../../redux/selectors";
import { compose } from "../../../utils";
import { withFetch } from "../../../components/Fetch";
import { fetchMonthDays } from "../../../redux/actionCreators";

const MonthCard = ({
  monthStr,
  children,
  daysData,
  active,
  onClick,
  stats
}) => {
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

const mapStateToProps = (state, { monthStr }) => ({
  daysData: selectMonthDays(state, monthStr)
});

MonthCard.defaultProps = {};

MonthCard.propTypes = {
  monthStr: PropTypes.string.isRequired,
  children: PropTypes.func.isRequired,
  daysData: dataPropType(PropTypes.arrayOf(PropTypes.string)).isRequired,
  active: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
  stats: shape({ income: number, expense: number }).isRequired
};

export default compose(
  connect(mapStateToProps),
  withFetch(({ monthStr, active, daysData }) => [
    !daysData.queried && active && fetchMonthDays(monthStr)
  ])
)(MonthCard);
