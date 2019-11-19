import React, { Fragment } from "react";
import { shape, func } from "prop-types";
import { Transaction, MonthCard, DayCard } from "./transactions";
import style from "./Transactions.module.scss";
import Button from "../../components/Button";
import {
  pushForm,
  getUrlParam,
  upsertReplaceUrlParams
} from "../../utils/navigation";
import Spinner from "../../components/Spinner";
import OnRender from "../../components/OnRender";
import { fetchMonthsQueryName, useDBApi } from "../../components/DBApi";

const activeParam = "active";

const Transactions = ({ history }) => {
  const monthsQueryData = useDBApi(fetchMonthsQueryName);

  const activeMonthStr = getUrlParam(history, activeParam);

  const handleActiveMonthStrChange = monthStr =>
    upsertReplaceUrlParams(history, { [activeParam]: monthStr });

  const monthsStats = (monthsQueryData && monthsQueryData.data) || {};

  const months = Object.keys(monthsStats).sort((month1, month2) =>
    month1 < month2 ? 1 : -1
  );
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
        {monthsQueryData.loading ? (
          <Spinner />
        ) : (
          months.map(monthStr => (
            <MonthCard
              monthStr={monthStr}
              stats={monthsStats[monthStr]}
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

Transactions.propTypes = {
  history: shape({ push: func.isRequired }).isRequired
};

export default Transactions;
