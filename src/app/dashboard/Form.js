import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { INCOME, EXPENSE } from "../../utils/constants";
import { addTransaction } from "../../redux/actions";

const amountId = "AMOUNT";
const typeId = "TYPE";
const types = [EXPENSE, INCOME];

class Form extends Component {
  state = { amount: 0, type: EXPENSE };

  handleAmountChange = ev => this.setState({ amount: ev.target.value });

  handleTypeChange = ev => this.setState({ type: ev.target.value });

  render = () => {
    const { handleSaveTransaction } = this.props;
    const { amount, type } = this.state;
    return (
      <div>
        <form
          onSubmit={ev => {
            ev.preventDefault();
            handleSaveTransaction({ amount: parseInt(amount, 10), type });
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
          <input type="submit" value="Guardar" />
        </form>
      </div>
    );
  };
}

Form.propTypes = {
  handleSaveTransaction: PropTypes.func.isRequired
};

const mapDispatchToProps = dispatch => ({
  handleSaveTransaction: transaction => dispatch(addTransaction(transaction))
});

export default connect(
  () => ({}),
  mapDispatchToProps
)(Form);
