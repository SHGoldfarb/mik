import React, { Fragment } from "react";
import Spinner from "../../components/Spinner";
import OnRender from "../../components/OnRender";
import { fetchMonthsQueryName, useDBApi } from "../../components/DBApi";
import { useHistory } from "../utils";
import { Transaction, MonthCard, DayCard, NavBar } from "./transactions";
import { useActiveMonthStr } from "./utils";
import style from "./Transactions.module.scss";

const Transactions = () => {
  const monthsQueryData = useDBApi(fetchMonthsQueryName);

  const history = useHistory();

  const [activeMonthStr, setActiveMothStr] = useActiveMonthStr();

  const monthsStats = (monthsQueryData && monthsQueryData.data) || {};

  const months = Object.keys(monthsStats).sort((month1, month2) =>
    month1 < month2 ? 1 : -1
  );

  return (
    <Fragment>
      <OnRender
        action={() => {
          if (months.length > 0 && activeMonthStr === undefined) {
            setActiveMothStr(months[0]);
          }
        }}
      />
      <NavBar className={style.navBar} />
      <div className={style.transactionsContainer}>
        {monthsQueryData.loading ? (
          <Spinner />
        ) : (
          months.map(monthStr => (
            <MonthCard
              monthStr={monthStr}
              stats={monthsStats[monthStr]}
              key={monthStr}
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

export default Transactions;
