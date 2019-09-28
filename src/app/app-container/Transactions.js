import React, { Fragment, Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Transaction, MonthCard, DayCard } from "./transactions";
import { selectAllMonths } from "../../redux/selectors";
import style from "./Transactions.module.scss";
import Button from "../../components/Button";
import { pushForm } from "../../utils/navigation";
import { compose } from "../../utils";
import { withFetch } from "../../components/Fetch";
import { fetchAllMonths } from "../../redux/actionCreators";
import Spinner from "../../components/Spinner";

class Transactions extends Component {
  state = { activeIndex: 0 };

  render = () => {
    const { monthsData, history } = this.props;
    const { activeIndex } = this.state;
    const months =
      monthsData.loading || !monthsData.data ? [] : monthsData.data;
    return (
      <Fragment>
        <Button
          className={style.createButton}
          onClick={() => pushForm(history)}
        >
          +
        </Button>
        <div className={style.transactionsContainer}>
          {monthsData.loading ? (
            <Spinner />
          ) : (
            months.map((monthStr, index) => (
              <MonthCard
                monthStr={monthStr}
                key={monthStr}
                active={index === activeIndex}
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
}

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
  withFetch(({ monthsData }) => [!monthsData.loaded && fetchAllMonths])
)(Transactions);
