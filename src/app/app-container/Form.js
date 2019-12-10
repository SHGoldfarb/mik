import React, { Fragment, useContext } from "react";
import { getUrlParam } from "../../utils/navigation";
import { EXPENSE } from "../../utils/constants";
import { useDBApi, fetchTransactionQueryName } from "../../components/DBApi";
import Spinner from "../../components/Spinner";
import BackButton from "../../components/BackButton";
import { AppContainerContext } from "../utils";
import {
  TypeInput,
  DateInput,
  AmountInput,
  CommentInput,
  TagsInput,
  SaveButton
} from "./form";
import style from "./Form.module.scss";
import State from "../../components/State";

const DeleteButton = () => <div>DeleteButton</div>;

const Form = () => {
  const { history } = useContext(AppContainerContext);
  const transactionId = getUrlParam(history, "id");
  const isEditing = !!transactionId;
  const transactionData = useDBApi(fetchTransactionQueryName, {
    variables: {
      id: parseInt(transactionId, 10)
    },
    skip: !isEditing
  });

  if (transactionData.loading) {
    return <Spinner />;
  }

  const oldTransaction = transactionData.data;

  return (
    <State
      initialState={
        oldTransaction || {
          type: EXPENSE,
          date: new Date(),
          tags: []
        }
      }
    >
      {([{ type, date, amount, comment, tags }, setValue]) => {
        const handleChange = valueName => value =>
          setValue(prevValues => ({ ...prevValues, [valueName]: value }));
        return (
          <Fragment>
            <BackButton />
            <TypeInput value={type} onChange={handleChange("type")} />
            <DateInput
              value={date}
              onChange={handleChange("date")}
              className={style.field}
            />
            <AmountInput
              value={amount}
              onChange={handleChange("amount")}
              className={style.field}
            />
            <CommentInput
              value={comment}
              onChange={handleChange("comment")}
              className={style.field}
            />
            <TagsInput
              value={tags}
              onChange={handleChange("tags")}
              className={style.field}
            />
            <SaveButton
              values={{ id: transactionId, type, date, amount, comment, tags }}
              oldTransaction={oldTransaction}
              isEditing={isEditing}
            />
            {isEditing && <DeleteButton id={transactionId} />}
          </Fragment>
        );
      }}
    </State>
  );
};

export default Form;
