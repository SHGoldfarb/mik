import React, { useRef, Fragment, useEffect } from "react";
import PropTypes, { shape, number } from "prop-types";
import Card from "../../../components/Card";
import { inCurrentTZ } from "../../../utils/date";
import I18N from "../../../config/I18N";
import style from "./MonthCard.module.scss";
import Spinner from "../../../components/Spinner";
import { fetchDaysQueryName, useDBApi } from "../../../components/DBApi";
import CardHeader from "./components/CardHeader";
import { useActiveMonthStr } from "../utils";

const scrollToRef = async ref =>
  window.scrollTo(0, ref.current.scrollIntoView());

const MonthCard = ({ monthStr, children, stats }) => {
  const [activeMonthStr, setActiveMothStr] = useActiveMonthStr();

  const active = activeMonthStr === monthStr;

  const daysData = useDBApi(fetchDaysQueryName, {
    variables: { monthStr },
    skip: !active
  });

  const cardRef = useRef(null);

  // useEffect(() => {
  //   if (active) {
  //     scrollToRef(cardRef);
  //   }
  // });

  const days = daysData.loading || !daysData.data ? [] : daysData.data;

  const date = inCurrentTZ(monthStr);
  const { income, expense } = stats;

  return (
    <Fragment>
      <div ref={cardRef} />
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
          scrollToRef(cardRef);
        }}
        theme={{ header: style.headerContainer }}
        id={monthStr}
      >
        {(active && (daysData.loading ? <Spinner /> : children(days))) || null}
      </Card>
    </Fragment>
  );
};

MonthCard.defaultProps = {};

MonthCard.propTypes = {
  monthStr: PropTypes.string.isRequired,
  children: PropTypes.func.isRequired,
  stats: shape({ income: number, expense: number }).isRequired
};

export default MonthCard;
