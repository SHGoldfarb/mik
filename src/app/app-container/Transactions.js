import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Transaction, MonthCard, DayCard } from "./transactions";
import { selectAllTransactionsByMonthByDay } from "../../redux/selectors";
import style from "./Transactions.module.scss";
import { transactionPropType } from "../../utils/propTypes";
import IncomeExpense from "../../components/IncomeExpense";
import Button from "../../components/Button";
import { pushForm } from "../../utils/navigation";

const Transactions = ({
  transactions: { income, expense, byMonth },
  history
}) => (
  <Fragment>
    <IncomeExpense income={income} expense={expense} className={style.total} />
    <div className={style.transactionsContainer}>
      <Button className={style.createButton} onClick={() => pushForm(history)}>
        +
      </Button>
      {Object.keys(byMonth).map(monthStr => {
        const { income: monthIncome, expense: monthExpense, byDay } = byMonth[
          monthStr
        ];

        return (
          <MonthCard
            monthStr={monthStr}
            key={monthStr}
            income={monthIncome}
            expense={monthExpense}
          >
            {Object.keys(byDay).map(dayStr => {
              const {
                income: dayIncome,
                expense: dayExpense,
                transactions: dayTransactions
              } = byDay[dayStr];
              return (
                <DayCard
                  dayStr={dayStr}
                  key={dayStr}
                  income={dayIncome}
                  expense={dayExpense}
                >
                  {dayTransactions.map(transaction => (
                    <Transaction
                      transaction={transaction}
                      key={transaction.id}
                      onClick={() => history.push(`/form?id=${transaction.id}`)}
                    />
                  ))}
                </DayCard>
              );
            })}
          </MonthCard>
        );
      })}
    </div>
  </Fragment>
);

const mapStateToProps = state => ({
  transactions: selectAllTransactionsByMonthByDay(state)
});

Transactions.propTypes = {
  transactions: PropTypes.shape({
    income: PropTypes.number.isRequired,
    expense: PropTypes.number.isRequired,
    byMonth: PropTypes.objectOf(
      PropTypes.shape({
        income: PropTypes.number.isRequired,
        expense: PropTypes.number.isRequired,
        byDay: PropTypes.objectOf(
          PropTypes.shape({
            income: PropTypes.number.isRequired,
            expense: PropTypes.number.isRequired,
            transactions: PropTypes.arrayOf(transactionPropType).isRequired
          })
        ).isRequired
      })
    ).isRequired
  }).isRequired,
  history: PropTypes.shape({ push: PropTypes.func.isRequired }).isRequired
};

export default connect(mapStateToProps)(Transactions);
