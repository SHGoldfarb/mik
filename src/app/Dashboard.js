import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { toMoneyString } from "../utils";
import { Transaction, NavBar, Form } from "./dashboard";
import { selectAllTransactions, selectTotal } from "../redux/selectors";
import style from "./Dashboard.module.css";

const TRANSACTIONS = "TRANSACTIONS";
const FORM = "FORM";

class Dashboard extends Component {
  state = { showing: TRANSACTIONS };

  render = () => {
    const { transactions, total } = this.props;
    const { showing } = this.state;
    return (
      <div className={style.dashboard}>
        {showing === TRANSACTIONS ? (
          <Fragment>
            <div className={style.total}>{toMoneyString(total)}</div>
            <div className={style.transactionsContainer}>
              {transactions.map(transaction => (
                <Transaction transaction={transaction} key={transaction.date} />
              ))}
            </div>
          </Fragment>
        ) : (
          <Form />
        )}
        <NavBar
          onShowForm={() => this.setState({ showing: FORM })}
          onShowTransactions={() => this.setState({ showing: TRANSACTIONS })}
        />
      </div>
    );
  };
}

Dashboard.propTypes = {
  transactions: PropTypes.arrayOf(
    PropTypes.shape({
      amount: PropTypes.number.isRequired,
      date: PropTypes.number.isRequired,
      account: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired
    })
  ).isRequired,
  total: PropTypes.number.isRequired
};

const mapStateToProps = state => ({
  transactions: selectAllTransactions(state),
  total: selectTotal(state)
});

export default connect(mapStateToProps)(Dashboard);
