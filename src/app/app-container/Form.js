import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
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
import {
  upsertTransaction,
  deleteTransaction
} from "../../redux/actionCreators";
import { compose, parseObjectData } from "../../utils";
import Spinner from "../../components/Spinner";
import {
  withDBApi,
  fetchTransactionQueryName,
  fetchTagsQueryName
} from "../../components/DBApi";

const tagsDatalistId = "TAGSDATALIST";
const types = [EXPENSE, INCOME];

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
      handleSaveTransaction,
      history,
      handleDeleteTransaction,
      tagsData,
      transactionData
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

    const handleSubmit = ev => {
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
      handleSaveTransaction(transaction);
      history.push("/");
    };

    const handleDelete = ev => {
      ev.preventDefault();
      handleDeleteTransaction(id);
      history.push("/");
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
  handleSaveTransaction: PropTypes.func.isRequired,
  handleDeleteTransaction: PropTypes.func.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
    goBack: PropTypes.func.isRequired
  }).isRequired,
  transactionData: dataPropType(transactionPropType).isRequired,
  tagsData: dataPropType(PropTypes.arrayOf(PropTypes.string)).isRequired
};
const getId = history => getUrlParam(history, "id");

const mapDispatchToProps = dispatch => ({
  handleSaveTransaction: upsertTransaction(dispatch),
  handleDeleteTransaction: deleteTransaction(dispatch)
});

const mapStateToProps = state => ({});

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  withDBApi(fetchTransactionQueryName, ({ history }) => ({
    variables: {
      id: parseInt(getId(history), 10)
    },
    skip: !getId(history),
    name: "transactionData"
  })),
  withDBApi(fetchTagsQueryName, () => ({ name: "tagsData" }))
)(Form);
