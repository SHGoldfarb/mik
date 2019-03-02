import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { deleteTransaction } from "../../../redux/actions";
import { transactionPropType } from "../../../utils/propTypes";
import { classnames, prettyCurrency } from "../../../utils";
import { EXPENSE } from "../../../utils/constants";
import { Modal, Button } from "../../../components";
import style from "./Transaction.module.css";
import { dictionary } from "../../../config";
import Clickable from "../../../components/Clickable";

class Transaction extends Component {
  state = { deleteing: false };

  handleDeleteCancel = () => this.setState({ deleteing: false });

  handleDeleteClick = () => this.setState({ deleteing: true });

  handleDeleteConfirm = () => {
    const { onDeleteTransaction, transaction } = this.props;
    onDeleteTransaction(transaction.id);
  };

  render = () => {
    const { transaction, onClick } = this.props;
    const { amount, date, type, comment } = transaction;
    const { deleteing } = this.state;
    const dateStr = new Date(date).toLocaleString();

    const { handleDeleteCancel, handleDeleteClick, handleDeleteConfirm } = this;

    return (
      <Clickable className={style.transactionContainer} onClick={onClick}>
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
            {prettyCurrency(amount)}
          </div>
        </div>
        <Modal onOverlayClick={handleDeleteCancel} active={deleteing}>
          {dictionary.transaction.confirmDelete}
          <Button onClick={handleDeleteConfirm}>{dictionary.yes}</Button>
        </Modal>
      </Clickable>
    );
  };
}

Transaction.propTypes = {
  transaction: transactionPropType.isRequired,
  onDeleteTransaction: PropTypes.func.isRequired,
  onClick: PropTypes.func.isRequired
};

const mapDispatchToProps = dispatch => ({
  onDeleteTransaction: id => dispatch(deleteTransaction(id))
});

export default connect(
  () => ({}),
  mapDispatchToProps
)(Transaction);
