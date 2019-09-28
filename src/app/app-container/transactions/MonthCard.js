import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Card from "../../../components/Card";
import IncomeExpense from "../../../components/IncomeExpense";
import { inCurrentTZ } from "../../../utils/date";
import PrettyDate from "../../../components/PrettyDate";
import I18N from "../../../config/I18N";
import style from "./MonthCard.module.scss";
import { dataPropType, transactionPropType } from "../../../utils/propTypes";
import Spinner from "../../../components/Spinner";
import {
  selectMonthStats,
  selectMonthTransactions
} from "../../../redux/selectors";
import { compose } from "../../../utils";
import { withFetch } from "../../../components/Fetch";
import {
  fetchMonthStats,
  fetchMonthTransactions
} from "../../../redux/actionCreators";

const MonthCard = ({
  monthStr,
  children,
  statsData,
  transactionsData,
  active
}) => {
  const transactions =
    transactionsData.loading || !transactionsData.data
      ? []
      : transactionsData.data;
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
      {active ? children(transactions) : null}
    </Card>
  );
};

const mapStateToProps = (state, { monthStr }) => ({
  statsData: selectMonthStats(state, monthStr),
  transactionsData: selectMonthTransactions(state, monthStr)
});

MonthCard.defaultProps = {};

MonthCard.propTypes = {
  monthStr: PropTypes.string.isRequired,
  children: PropTypes.func.isRequired,
  statsData: dataPropType(
    PropTypes.shape({ income: PropTypes.number, expense: PropTypes.number })
  ).isRequired,
  transactionsData: dataPropType(PropTypes.arrayOf(transactionPropType))
    .isRequired,
  active: PropTypes.bool.isRequired
};

export default compose(
  withFetch(({ monthStr, active }) => [
    fetchMonthStats(monthStr),
    active ? fetchMonthTransactions(monthStr) : () => {}
  ]),
  connect(mapStateToProps)
)(MonthCard);
