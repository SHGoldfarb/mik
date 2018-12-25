import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Button } from "../../components";
import { INCOME, EXPENSE } from "../../utils/constants";
import { addTransaction } from "../../redux/actions";
import style from "./Form.module.css";
import { dictionary } from "../../config";

const amountId = "AMOUNT";
const typeId = "TYPE";
const commentId = "COMMENT";
const types = [EXPENSE, INCOME];

class Form extends Component {
  state = { amount: "", type: EXPENSE, comment: "" };

  formRef = React.createRef();

  componentDidMount() {
    this.firstInput.focus();
  }

  handleAmountChange = ev => this.setState({ amount: ev.target.value });

  handleTypeChange = ev => this.setState({ type: ev.target.value });

  handleCommentChange = ev => this.setState({ comment: ev.target.value });

  render = () => {
    const {
      handleSaveTransaction,
      showing: { handleShowingChange, TRANSACTIONS }
    } = this.props;
    const { amount, type, comment } = this.state;
    const handleSubmit = ev => {
      ev.preventDefault();
      handleSaveTransaction({
        amount: parseInt(amount, 10),
        type,
        comment
      });
      handleShowingChange(TRANSACTIONS);
    };
    return (
      <div>
        <form ref={this.formRef} className={style.form} onSubmit={handleSubmit}>
          <label className={style.label} htmlFor={typeId}>
            {`${dictionary.transaction.type}:`}
            <select
              className={style.input}
              id={typeId}
              onChange={this.handleTypeChange}
              value={type}
            >
              {types.map(value => (
                <option value={value} key={value}>
                  {value}
                </option>
              ))}
            </select>
          </label>
          <label className={style.label} htmlFor={amountId}>
            {`${dictionary.transaction.amount}:`}
            <input
              className={style.input}
              type="number"
              id={amountId}
              onChange={this.handleAmountChange}
              value={amount}
              ref={element => {
                this.firstInput = element;
              }}
            />
          </label>

          <label className={style.label} htmlFor={commentId}>
            {`${dictionary.transaction.comment}:`}
            <input
              className={style.input}
              type="text"
              id={commentId}
              onChange={this.handleCommentChange}
              value={comment}
            />
          </label>
          <input type="submit" hidden />
          <Button onClick={handleSubmit}>{dictionary.transaction.save}</Button>
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
