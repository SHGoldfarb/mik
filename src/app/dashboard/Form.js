import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { INCOME, EXPENSE } from "../../utils/constants";
import { addTransaction } from "../../redux/actions";
import style from "./Form.module.css";

const amountId = "AMOUNT";
const typeId = "TYPE";
const commentId = "COMMENT";
const types = [EXPENSE, INCOME];

class Form extends Component {
  state = { amount: 0, type: EXPENSE, comment: "" };

  handleAmountChange = ev => this.setState({ amount: ev.target.value });

  handleTypeChange = ev => this.setState({ type: ev.target.value });

  handleCommentChange = ev => this.setState({ comment: ev.target.value });

  render = () => {
    const {
      handleSaveTransaction,
      showing: { handleShowingChange, TRANSACTIONS }
    } = this.props;
    const { amount, type, comment } = this.state;
    return (
      <div>
        <form
          className={style.form}
          onSubmit={ev => {
            ev.preventDefault();
            handleSaveTransaction({
              amount: parseInt(amount, 10),
              type,
              comment
            });
            handleShowingChange(TRANSACTIONS);
          }}
        >
          <label htmlFor={amountId}>
            Amount
            <input
              type="number"
              id={amountId}
              onChange={this.handleAmountChange}
              value={amount}
            />
          </label>
          <label htmlFor={typeId}>
            Type
            <select id={typeId} onChange={this.handleTypeChange} value={type}>
              {types.map(value => (
                <option value={value} key={value}>
                  {value}
                </option>
              ))}
            </select>
          </label>
          <label htmlFor={commentId}>
            Comment
            <input
              type="text"
              id={commentId}
              onChange={this.handleCommentChange}
              value={comment}
            />
          </label>
          <input type="submit" value="Guardar" />
        </form>
      </div>
    );
  };
}

Form.propTypes = {
  handleSaveTransaction: PropTypes.func.isRequired,
  showing: PropTypes.shape({
    handleShowingChange: PropTypes.func.isRequired,
    TRANSACTIONS: PropTypes.string.isRequired
  }).isRequired
};

const mapDispatchToProps = dispatch => ({
  handleSaveTransaction: transaction => dispatch(addTransaction(transaction))
});

export default connect(
  () => ({}),
  mapDispatchToProps
)(Form);
