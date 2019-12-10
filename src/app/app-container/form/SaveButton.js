import React, { useContext } from "react";
import { bool } from "prop-types";
import { I18N } from "../../../config";
import Button from "../../../components/Button";
import {
  useDBApi,
  upsertTransactionMutationName
} from "../../../components/DBApi";
import { CASH } from "../../../utils/constants";
import { transactionPropType } from "../../../utils/validators";
import { executeCommand } from "../../../utils/commands";
import { AppContainerContext } from "../../utils";
import {
  goToTransactionsView,
  removeTransactionFromStore,
  addTransactionToStore
} from "./utils";

const SaveButton = ({
  values: { id, type, date, amount, comment, tags },
  oldTransaction,
  isEditing
}) => {
  const { history } = useContext(AppContainerContext);
  const upsertMutation = useDBApi(upsertTransactionMutationName);
  const goToTransactions = () => goToTransactionsView(history, date);

  const handleSubmit = async () => {
    if (await executeCommand(comment)) {
      goToTransactions();
      return false;
    }

    const transaction = {
      amount: parseInt(amount, 10),
      type,
      comment,
      date: new Date(date).getTime(),
      tags,
      account: CASH
    };
    if (isEditing) {
      transaction.id = id;
    }

    const mutationResult = await upsertMutation({
      variables: { transaction },
      update: (newTransaction, store) => {
        if (isEditing) {
          removeTransactionFromStore(store, oldTransaction);
        }
        addTransactionToStore(store, newTransaction);
      }
    });

    goToTransactions();
    return mutationResult;
  };
  return <Button onClick={handleSubmit}>{I18N.actions.save}</Button>;
};

SaveButton.defaultProps = {
  oldTransaction: {}
};

SaveButton.propTypes = {
  values: transactionPropType.isRequired,
  oldTransaction: transactionPropType,
  isEditing: bool.isRequired
};

export default SaveButton;
