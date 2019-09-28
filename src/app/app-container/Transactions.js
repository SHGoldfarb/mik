import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Transaction, MonthCard, DayCard } from "./transactions";
import { selectAllMonths } from "../../redux/selectors";
import style from "./Transactions.module.scss";
import Button from "../../components/Button";
import {
  pushForm,
  getUrlParam,
  upsertReplaceUrlParams
} from "../../utils/navigation";
import { compose } from "../../utils";
import { withFetch } from "../../components/Fetch";
import { fetchAllMonths } from "../../redux/actionCreators";
import Spinner from "../../components/Spinner";
import OnRender from "../../components/OnRender";

const activeParam = "active";

const Transactions = ({ monthsData, history }) => {
  const activeMonthStr = getUrlParam(history, activeParam);

  const handleActiveMonthStrChange = monthStr =>
    upsertReplaceUrlParams(history, { [activeParam]: monthStr });

  const months = monthsData.loading || !monthsData.data ? [] : monthsData.data;
  return (
    <Fragment>
      <OnRender
        action={() => {
          if (months.length > 0 && activeMonthStr === undefined) {
            handleActiveMonthStrChange(months[0]);
          }
        }}
      />
      <Button className={style.createButton} onClick={() => pushForm(history)}>
        +
      </Button>
      <div className={style.transactionsContainer}>
        {monthsData.loading ? (
          <Spinner />
        ) : (
          months.map(monthStr => (
            <MonthCard
              monthStr={monthStr}
              key={monthStr}
              active={monthStr === activeMonthStr}
              onClick={() => handleActiveMonthStrChange(monthStr)}
            >
              {days =>
                days.map(dayStr => (
                  <DayCard dayStr={dayStr} key={dayStr}>
                    {dayTransactions =>
                      dayTransactions.map(transaction => (
                        <Transaction
                          transaction={transaction}
                          key={transaction.id}
                          onClick={() =>
                            history.push(`/form?id=${transaction.id}`)
                          }
                        />
                      ))
                    }
                  </DayCard>
                ))
              }
            </MonthCard>
          ))
        )}
      </div>
    </Fragment>
  );
};

const mapStateToProps = state => ({
  monthsData: selectAllMonths(state)
});

Transactions.propTypes = {
  monthsData: PropTypes.shape({
    data: PropTypes.arrayOf(PropTypes.string),
    loading: PropTypes.bool
  }).isRequired,
  history: PropTypes.shape({ push: PropTypes.func.isRequired }).isRequired
};

export default compose(
  connect(mapStateToProps),
  withFetch(({ monthsData }) => [!monthsData.queried && fetchAllMonths])
)(Transactions);
