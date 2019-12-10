import React, { Fragment, useContext } from "react";
import { getUrlParam } from "../../utils/navigation";
import { EXPENSE } from "../../utils/constants";
import { useDBApi, fetchTransactionQueryName } from "../../components/DBApi";
import Spinner from "../../components/Spinner";
import BackButton from "../../components/BackButton";
import State from "../../components/State";
import { AppContainerContext } from "../utils";
import {
  TypeInput,
  DateInput,
  AmountInput,
  CommentInput,
  TagsInput,
  SaveButton,
  DeleteButton
} from "./form";
import style from "./Form.module.scss";

const Form = () => {
  const { history } = useContext(AppContainerContext);
  const transactionId = getUrlParam(history, "id");

  const transactionData = useDBApi(fetchTransactionQueryName, {
    variables: {
      id: parseInt(transactionId, 10)
    },
    skip: !transactionId
  });

  if (transactionData.loading) {
    return <Spinner />;
  }

  const oldTransaction = transactionData.data;

  const isEditing = !!(oldTransaction && oldTransaction.id);

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
      {([{ id, type, date, amount = "", comment = "", tags }, setValue]) => {
        const handleChange = valueName => value =>
          setValue(prevValues => ({ ...prevValues, [valueName]: value }));
        return (
          <Fragment>
            <BackButton />
            <TypeInput value={type} onChange={handleChange("type")} />
            <DateInput
              value={new Date(date)}
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
              values={{
                id,
                type,
                date: new Date(date).getTime(),
                amount: parseInt(amount, 10),
                comment,
                tags
              }}
              oldTransaction={oldTransaction}
              isEditing={isEditing}
            />
            {isEditing && <DeleteButton id={id} />}
          </Fragment>
        );
      }}
    </State>
  );
};

export default Form;
