import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { deleteTransaction } from "../../redux/actions";
import { transactionPropType } from "../../utils/propTypes";
import { classnames, toMoneyString } from "../../utils";
import { EXPENSE } from "../../utils/constants";
import { Modal, Button } from "../../components";
import style from "./Transaction.module.css";
import { dictionary } from "../../config";

class Transaction extends Component {
  state = { deleteing: false };

  handleDeleteCancel = () => this.setState({ deleteing: false });

  handleDeleteClick = () => this.setState({ deleteing: true });

  handleDeleteConfirm = () => {
    const { onDeleteTransaction, transaction } = this.props;
    onDeleteTransaction(transaction.id);
  };

  render = () => {
    const { transaction } = this.props;
    const { amount, date, type, comment } = transaction;
    const { deleteing } = this.state;
    const dateStr = new Date(date).toLocaleString();

    const { handleDeleteCancel, handleDeleteClick, handleDeleteConfirm } = this;

    return (
      <div className={style.transactionContainer}>
        <div className={style.dateContainer}>
          {dateStr}
          <Button onClick={handleDeleteClick} className={style.deleteButton}>
            {dictionary.delete}
          </Button>
        </div>
        <div className={style.commentAmountContainer}>
          <div className={style.commentContainer}>{comment}</div>
          <div
            className={classnames(
              style.amountContainer,
              type === EXPENSE ? style.expense : style.income
            )}
          >
            {toMoneyString(amount)}
          </div>
        </div>
        <Modal onOverlayClick={handleDeleteCancel} active={deleteing}>
          Are you sure you want to delete?
          <Button onClick={handleDeleteConfirm}>Yes</Button>
        </Modal>
      </div>
    );
  };
}

Transaction.propTypes = {
  transaction: transactionPropType.isRequired,
  onDeleteTransaction: PropTypes.func.isRequired
};

const mapDispatchToProps = dispatch => ({
  onDeleteTransaction: id => dispatch(deleteTransaction(id))
});

export default connect(
  () => ({}),
  mapDispatchToProps
)(Transaction);
