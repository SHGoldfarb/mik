import React, { Component } from "react";
import PropTypes from "prop-types";
import { INCOME, EXPENSE, CASH } from "../../utils/constants";
import style from "./Form.module.css";
import { I18N } from "../../config";
import { transactionPropType, dataPropType } from "../../utils/propTypes";
import Clickable from "../../components/Clickable";
import Button from "../../components/Button";
import Modal from "../../components/Modal";
import Input from "../../components/inputs/Input";
import { getUrlParam } from "../../utils/navigation";
import SelectInput from "../../components/inputs/SelectInput";
import uniques from "../../utils/uniques";
import { compose, parseObjectData } from "../../utils";
import Spinner from "../../components/Spinner";
import {
  withDBApi,
  fetchTransactionQueryName,
  fetchTagsQueryName,
  upsertTransactionMutationName,
  deleteTransactionMutationName,
  fetchMonthsQueryName
} from "../../components/DBApi";
import { getIncomeExpense } from "../../utils/stats";
import { getDateStrings } from "../../utils/date";

const tagsDatalistId = "TAGSDATALIST";
const types = [EXPENSE, INCOME];

const removeTransactionFromMonths = (months, transaction) => {
  // Remove amount from old month
  const { monthStr: oldMonth } = getDateStrings(transaction.date);

  const {
    income: oldTransactionIncome,
    expense: oldTransactionExpense
  } = getIncomeExpense(transaction);
  const { income: oldIncome, expense: oldExpense } = months[oldMonth] || {
    income: 0,
    expense: 0
  };
  return {
    ...months,
    [oldMonth]: {
      income: oldIncome - oldTransactionIncome,
      expense: oldExpense - oldTransactionExpense
    }
  };
};

const addTransactionToMonths = (months, transaction) => {
  // Add amount to new month
  const { monthStr: newMonth } = getDateStrings(transaction.date);
  const {
    income: newTransactionIncome,
    expense: newTransactionExpense
  } = getIncomeExpense(transaction);
  const { income: oldIncome, expense: oldExpense } = months[newMonth] || {
    income: 0,
    expense: 0
  };
  return {
    ...months,
    [newMonth]: {
      income: oldIncome + newTransactionIncome,
      expense: oldExpense + newTransactionExpense
    }
  };
};

class Form extends Component {
  state = {
    amount: "",
    type: EXPENSE,
    comment: "",
    date: new Date(new Date() - new Date().getTimezoneOffset() * 60 * 1000)
      .toISOString()
      .slice(0, 16),
    tags: [],
    editing: false,
    deleteModalActive: false,
    tagInputValue: ""
  };

  formRef = React.createRef();

  static getDerivedStateFromProps = ({ transactionData }, { editing }) => {
    const transaction = parseObjectData(transactionData);
    if (transaction && !editing) {
      return {
        ...transaction,
        date: new Date(
          new Date(transaction.date) -
            new Date().getTimezoneOffset() * 60 * 1000
        )
          .toISOString()
          .slice(0, 16),
        editing: true
      };
    }
    return null;
  };

  focusOnFirstInputWhenMounted = () => {
    const { focusedOnFirstInput } = this.state;
    if (this.firstInput && !focusedOnFirstInput) {
      this.firstInput.focus();
      this.setState({ focusedOnFirstInput: true });
    }
  };

  componentDidMount = () => {
    this.focusOnFirstInputWhenMounted();
  };

  componentDidUpdate = () => {
    this.focusOnFirstInputWhenMounted();
  };

  handleFieldChange = field => ev => {
    this.setState({ [field]: ev.target.value });
  };

  render = () => {
    const {
      history,
      deleteMutation,
      tagsData,
      transactionData,
      upsertMutation
    } = this.props;

    if (transactionData.loading) {
      return <Spinner />;
    }

    const existingTags =
      tagsData.loading || tagsData.error || !tagsData.data ? [] : tagsData.data;

    const {
      amount,
      type,
      comment,
      date,
      id,
      editing,
      deleteModalActive,
      tags,
      tagInputValue
    } = this.state;

    const handleAmountChange = this.handleFieldChange("amount");
    const handleTypeChange = this.handleFieldChange("type");
    const handleCommentChange = this.handleFieldChange("comment");
    const handleDateChange = this.handleFieldChange("date");
    const handleTagInputValueChange = this.handleFieldChange("tagInputValue");

    const handleAddTag = tag =>
      this.setState(({ tags: prevTags }) => ({
        tags: uniques([...prevTags, tag]),
        tagInputValue: ""
      }));

    const handleRemoveTag = tag => {
      this.setState(({ tags: prevTags }) => ({
        tags: prevTags.filter(prevTag => prevTag !== tag)
      }));
    };

    const handleSubmit = async ev => {
      ev.preventDefault();
      const transaction = {
        amount: parseInt(amount, 10),
        type,
        comment,
        date: new Date(date).getTime(),
        tags,
        account: CASH
      };
      if (id) {
        transaction.id = id;
      }

      const oldTransaction = parseObjectData(transactionData);

      const mutationResult = await upsertMutation({
        variables: { transaction },
        update: (newTransaction, store) => {
          let months;
          if ((months = store.getData(fetchMonthsQueryName))) {
            if (id) {
              months = removeTransactionFromMonths(months, oldTransaction);
            }
            months = addTransactionToMonths(months, newTransaction);
            store.setData(fetchMonthsQueryName, {
              data: months
            });
          }
        }
      });

      history.push("/");
      return mutationResult;
    };

    const handleDelete = async ev => {
      ev.preventDefault();
      const mutationResult = await deleteMutation({
        variables: { id },
        update: (deletedTransaction, store) => {
          let months;
          if ((months = store.getData(fetchMonthsQueryName))) {
            months = removeTransactionFromMonths(months, deletedTransaction);
            store.setData(fetchMonthsQueryName, {
              data: months
            });
          }
        }
      });
      history.push("/");
      return mutationResult;
    };

    const choosableTags = existingTags.filter(
      existingTag => !tags.includes(existingTag)
    );

    return (
      <div>
        <Button className={style.backButton} onClick={() => history.goBack()}>
          {`\u2190 ${I18N.back}`}
        </Button>
        <form ref={this.formRef} className={style.form} onSubmit={handleSubmit}>
          <SelectInput
            className={style.label}
            label={`${I18N.transaction.type}:`}
            inputClassName={style.input}
            onChange={handleTypeChange}
            value={type}
            options={types}
          />

          <Input
            className={style.label}
            label={`${I18N.transaction.date}:`}
            inputClassName={style.input}
            type="datetime-local"
            onChange={handleDateChange}
            value={date}
          />

          <Input
            className={style.label}
            label={`${I18N.transaction.amount}:`}
            inputClassName={style.input}
            type="number"
            onChange={handleAmountChange}
            value={amount}
            ref={element => {
              this.firstInput = element;
            }}
          />

          <Input
            className={style.label}
            label={`${I18N.transaction.comment}:`}
            inputClassName={style.input}
            type="text"
            onChange={handleCommentChange}
            value={comment}
          />

          <Input
            className={style.label}
            label={`${I18N.transaction.tags}:`}
            autoComplete="off"
            inputClassName={style.input}
            list={tagsDatalistId}
            value={tagInputValue}
            onKeyUp={ev => {
              if (ev.which === undefined) {
                // One of the datalist options was clicked on
                ev.preventDefault();
                handleAddTag(ev.target.value);
              }
            }}
            onChange={ev => {
              handleTagInputValueChange(ev);
            }}
            onKeyPress={ev => {
              if (ev.key === "Enter") {
                ev.preventDefault();
                handleAddTag(ev.target.value);
              }
            }}
            placeholder={tagsData.loading ? I18N.placeholders.loading_dots : ""}
            disabled={tagsData.loading}
          >
            <datalist id={tagsDatalistId}>
              {choosableTags.map(tag => (
                <option key={tag} value={tag} />
              ))}
            </datalist>
          </Input>
          {tags.map(tag => (
            <Clickable key={tag} onClick={() => handleRemoveTag(tag)}>
              {tag}
            </Clickable>
          ))}
          <input type="submit" hidden />
          <Button onClick={handleSubmit}>{I18N.transaction.save}</Button>
          {editing ? (
            <Button onClick={() => this.setState({ deleteModalActive: true })}>
              {I18N.transaction.delete}
            </Button>
          ) : null}
        </form>
        <Modal
          onOverlayClick={() => this.setState({ deleteModalActive: false })}
          active={deleteModalActive}
        >
          {I18N.transaction.confirmDelete}
          <Button onClick={handleDelete}>{I18N.yes}</Button>
        </Modal>
      </div>
    );
  };
}

Form.propTypes = {
  upsertMutation: PropTypes.func.isRequired,
  deleteMutation: PropTypes.func.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
    goBack: PropTypes.func.isRequired
  }).isRequired,
  transactionData: dataPropType(transactionPropType).isRequired,
  tagsData: dataPropType(PropTypes.arrayOf(PropTypes.string)).isRequired
};
const getId = history => getUrlParam(history, "id");

export default compose(
  withDBApi(fetchTransactionQueryName, ({ history }) => ({
    variables: {
      id: parseInt(getId(history), 10)
    },
    skip: !getId(history),
    name: "transactionData"
  })),
  withDBApi(fetchTagsQueryName, () => ({ name: "tagsData" })),
  withDBApi(upsertTransactionMutationName, () => ({ name: "upsertMutation" })),
  withDBApi(deleteTransactionMutationName, () => ({ name: "deleteMutation" }))
)(Form);
