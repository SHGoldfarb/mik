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
const dateId = "DATE";
const types = [EXPENSE, INCOME];

class Form extends Component {
  state = {
    amount: "",
    type: EXPENSE,
    comment: "",
    date: new Date(new Date() - new Date().getTimezoneOffset() * 60 * 1000)
      .toISOString()
      .slice(0, 16)
  };

  formRef = React.createRef();

  componentDidMount = () => {
    this.firstInput.focus();
  };

  handleFieldChange = field => ev =>
    this.setState({ [field]: ev.target.value });

  render = () => {
    const { handleSaveTransaction, history } = this.props;
    const { amount, type, comment, date } = this.state;
    const handleAmountChange = this.handleFieldChange("amount");
    const handleTypeChange = this.handleFieldChange("type");
    const handleCommentChange = this.handleFieldChange("comment");
    const handleDateChange = this.handleFieldChange("date");

    const handleSubmit = ev => {
      ev.preventDefault();
      handleSaveTransaction({
        amount: parseInt(amount, 10),
        type,
        comment,
        date
      });
      history.push("/");
    };
    return (
      <div>
        <form ref={this.formRef} className={style.form} onSubmit={handleSubmit}>
          <label className={style.label} htmlFor={typeId}>
            {`${dictionary.transaction.type}:`}
            <select
              className={style.input}
              id={typeId}
              onChange={handleTypeChange}
              value={type}
            >
              {types.map(value => (
                <option value={value} key={value}>
                  {value}
                </option>
              ))}
            </select>
          </label>

          <label className={style.label} htmlFor={dateId}>
            {`${dictionary.transaction.date}: ${date}`}
            <input
              className={style.input}
              type="datetime-local"
              id={dateId}
              onChange={handleDateChange}
              value={date}
            />
          </label>

          <label className={style.label} htmlFor={amountId}>
            {`${dictionary.transaction.amount}:`}
            <input
              className={style.input}
              type="number"
              id={amountId}
              onChange={handleAmountChange}
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
              onChange={handleCommentChange}
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
  history: PropTypes.shape({ push: PropTypes.func.isRequired }).isRequired
};

const mapDispatchToProps = dispatch => ({
  handleSaveTransaction: transaction => dispatch(addTransaction(transaction))
});

export default connect(
  () => ({}),
  mapDispatchToProps
)(Form);