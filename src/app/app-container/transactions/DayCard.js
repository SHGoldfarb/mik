import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Card from "../../../components/Card";
import IncomeExpense from "../../../components/IncomeExpense";
import { inCurrentTZ } from "../../../utils/date";
import PrettyDate from "../../../components/PrettyDate";
import I18N from "../../../config/I18N";
import { dataPropType, transactionPropType } from "../../../utils/propTypes";
import { compose } from "../../../utils";
import { withFetch } from "../../../components/Fetch";
import {
  selectDayStats,
  selectDayTransactions
} from "../../../redux/selectors";
import {
  fetchDayStats,
  fetchDayTransactions
} from "../../../redux/actionCreators";
import Spinner from "../../../components/Spinner";

const DayCard = ({ dayStr, children, statsData, transactionsData }) => {
  const { income, expense } =
    statsData.loading || !statsData.data
      ? { income: null, expense: null }
      : statsData.data;

  const transactions =
    transactionsData.loading || !transactionsData.data
      ? []
      : transactionsData.data;

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
        statsData.loading ? (
          <Spinner />
        ) : (
          <IncomeExpense income={income} expense={expense} />
        )
      }
    >
      {transactionsData.loading ? <Spinner /> : children(transactions)}
    </Card>
  );
};

const mapStateToProps = (state, { dayStr }) => ({
  statsData: selectDayStats(state, dayStr),
  transactionsData: selectDayTransactions(state, dayStr)
});

DayCard.defaultProps = {};

DayCard.propTypes = {
  dayStr: PropTypes.string.isRequired,
  children: PropTypes.func.isRequired,
  statsData: dataPropType(
    PropTypes.shape({ income: PropTypes.number, expense: PropTypes.number })
  ).isRequired,
  transactionsData: dataPropType(PropTypes.arrayOf(transactionPropType))
    .isRequired
};

export default compose(
  connect(mapStateToProps),
  withFetch(({ dayStr, statsData, transactionsData }) => [
    !statsData.loaded && fetchDayStats(dayStr),
    !transactionsData.loaded && fetchDayTransactions(dayStr)
  ])
)(DayCard);
