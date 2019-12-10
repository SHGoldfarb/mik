import React, { useContext } from "react";
import { I18N } from "../../../config";
import Button from "../../../components/Button";
import {
  useDBApi,
  upsertTransactionMutationName,
  fetchMonthsQueryName,
  fetchTagsQueryName,
  fetchTransactionsQueryName,
  fetchTransactionQueryName,
  fetchDaysQueryName
} from "../../../components/DBApi";
import { CASH } from "../../../utils/constants";
import { transactionPropType } from "../../../utils/validators";
import { executeCommand } from "../../../utils/commands";
import { AppContainerContext } from "../../utils";
import { goToTransactionsView } from "./utils";
import { getDateStrings } from "../../../utils/date";
import { getIncomeExpense } from "../../../utils/stats";
import uniques from "../../../utils/uniques";

const removeTransactionFromMonths = (months, transaction) => {
  // Remove amount from old month
  const { monthStr: oldMonth } = getDateStrings(transaction.date);

  const {
    income: oldTransactionIncome,
    expense: oldTransactionExpense
  } = getIncomeExpense(transaction);
  const { income: oldIncome, expense: oldExpense } = months[oldMonth];
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

const addTransactionToTags = (tags, transaction) =>
  uniques([...tags, ...transaction.tags]);

const removeTransactionFromTransactions = (transactions, transaction) =>
  transactions.filter(({ id }) => id !== transaction.id);

const addTransactionToTransactions = (transactions, transaction) =>
  [...transactions, transaction].sort((t1, t2) => (t1.date < t2.date ? 1 : -1));

const addTransactionToDays = (days, transaction) => {
  const { dayStr } = getDateStrings(transaction.date);
  return uniques([...days, dayStr]).sort((day1, day2) =>
    day1 < day2 ? 1 : -1
  );
};

const SaveButton = ({
  values: { id, type, date, amount, comment, tags },
  oldTransaction
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
    if (id) {
      transaction.id = id;
    }

    const mutationResult = await upsertMutation({
      variables: { transaction },
      update: (newTransaction, store) => {
        // Update month stats
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

        // Add new tags
        let storedTags;
        if ((storedTags = store.getData(fetchTagsQueryName))) {
          storedTags = addTransactionToTags(storedTags, newTransaction);
          store.setData(fetchTagsQueryName, { data: storedTags });
        }

        // Remove old from day transactions
        let storedTransactions;
        let dayStr;
        if (id) {
          ({ dayStr } = getDateStrings(oldTransaction.date));
          if (
            (storedTransactions = store.getData(fetchTransactionsQueryName, {
              dayStr
            }))
          ) {
            storedTransactions = removeTransactionFromTransactions(
              storedTransactions,
              oldTransaction
            );

            store.setData(fetchTransactionsQueryName, {
              variables: { dayStr },
              data: storedTransactions
            });
          }
        }

        // Add new to day transactions
        // If the day is the same, use the transactions already retrieved
        if (
          !(
            storedTransactions &&
            dayStr === getDateStrings(newTransaction.date).dayStr
          )
        ) {
          storedTransactions = store.getData(fetchTransactionsQueryName, {
            dayStr: getDateStrings(newTransaction.date).dayStr
          });
        }
        ({ dayStr } = getDateStrings(newTransaction.date));
        if (storedTransactions) {
          storedTransactions = addTransactionToTransactions(
            storedTransactions,
            newTransaction
          );

          store.setData(fetchTransactionsQueryName, {
            variables: { dayStr },
            data: storedTransactions
          });
        }

        // Add new single transaction

        store.setData(fetchTransactionQueryName, {
          variables: { id: newTransaction.id },
          data: newTransaction
        });

        // Add new day to month

        let days;
        const { monthStr } = getDateStrings(newTransaction.date);
        if ((days = store.getData(fetchDaysQueryName, { monthStr }))) {
          days = addTransactionToDays(days, newTransaction);
          store.setData(fetchDaysQueryName, {
            variables: { monthStr },
            data: days
          });
        }
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
  oldTransaction: transactionPropType
};

export default SaveButton;
