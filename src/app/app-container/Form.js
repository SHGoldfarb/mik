import React, { Fragment } from "react";
import { getUrlParam } from "../../utils/navigation";
import { EXPENSE } from "../../utils/constants";
import { historyPropType } from "../../utils/propTypes";
import { useDBApi, fetchTransactionQueryName } from "../../components/DBApi";
import Spinner from "../../components/Spinner";
import State from "../../components/State";
import BackButton from "../../components/BackButton";
import { TypeInput, DateInput } from "./form";
import style from "./Form.module.scss";

const AmountInput = () => <div>AmountInput</div>;
const CommentInput = () => <div>CommentInput</div>;
const TagsInput = () => <div>TagsInput</div>;
const SaveButton = () => <div>SaveButton</div>;
const DeleteButton = () => <div>DeleteButton</div>;

const Form = ({ history }) => {
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

  return (
    <State
      initialState={
        transactionData.data || {
          type: EXPENSE,
          date: new Date()
        }
      }
    >
      {({ type, date, amount, comment, tags }, setValue) => {
        const handleChange = valueName => value =>
          setValue(prevValues => ({ ...prevValues, [valueName]: value }));
        return (
          <Fragment>
            <BackButton history={history} />
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
              history={history}
            />
            {isEditing && <DeleteButton id={transactionId} history={history} />}
          </Fragment>
        );
      }}
    </State>
  );
};

Form.propTypes = {
  history: historyPropType.isRequired
};

export default Form;
