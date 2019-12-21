import React from "react";
import PropTypes, { shape, number } from "prop-types";
import Card from "../../../components/Card";
import { inCurrentTZ } from "../../../utils/date";
import I18N from "../../../config/I18N";
import style from "./MonthCard.module.scss";
import Spinner from "../../../components/Spinner";
import { fetchDaysQueryName, useDBApi } from "../../../components/DBApi";
import CardHeader from "./components/CardHeader";
import { useActiveMonthStr } from "../utils";
import ScrollHere from "../../../components/ScrollHere";

const MonthCard = ({ monthStr, children, stats }) => {
  const [activeMonthStr, setActiveMothStr] = useActiveMonthStr();

  const active = activeMonthStr === monthStr;

  const daysData = useDBApi(fetchDaysQueryName, {
    variables: { monthStr },
    skip: !active
  });

  const days = daysData.loading || !daysData.data ? [] : daysData.data;

  const date = inCurrentTZ(monthStr);
  const { income, expense } = stats;

  return (
    <ScrollHere condition={active}>
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
        onHeaderClick={() => {
          setActiveMothStr(monthStr);
        }}
        theme={{ header: style.headerContainer }}
        id={monthStr}
      >
        {(active && (daysData.loading ? <Spinner /> : children(days))) || null}
      </Card>
    </ScrollHere>
  );
};

MonthCard.defaultProps = {};

MonthCard.propTypes = {
  monthStr: PropTypes.string.isRequired,
  children: PropTypes.func.isRequired,
  stats: shape({ income: number, expense: number }).isRequired
};

export default MonthCard;
