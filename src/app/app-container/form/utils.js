import {
  fetchMonthsQueryName,
  fetchTagsQueryName,
  fetchTransactionsQueryName,
  fetchTransactionQueryName,
  fetchDaysQueryName
} from "../../../components/DBApi";
import { getDateStrings } from "../../../utils/date";
import { getIncomeExpense } from "../../../utils/stats";
import uniques from "../../../utils/uniques";

export const goToTransactionsView = (history, date) =>
  history.push(`/?active=${getDateStrings(date).monthStr}`);

// =========================================================
// ------------------ dbApi store updater ------------------

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

export const removeTransactionFromStore = (store, transaction) => {
  // Update month stats
  let months;
  if ((months = store.getData(fetchMonthsQueryName))) {
    months = removeTransactionFromMonths(months, transaction);
    store.setData(fetchMonthsQueryName, {
      data: months
    });
  }

  // Remove old from day transactions
  let storedTransactions;
  const { dayStr } = getDateStrings(transaction.date);
  if (
    (storedTransactions = store.getData(fetchTransactionsQueryName, {
      dayStr
    }))
  ) {
    storedTransactions = removeTransactionFromTransactions(
      storedTransactions,
      transaction
    );

    store.setData(fetchTransactionsQueryName, {
      variables: { dayStr },
      data: storedTransactions
    });
  }

  // Remove single transaction

  store.setData(fetchTransactionQueryName, {
    variables: { id: transaction.id },
    data: null
  });
};

export const addTransactionToStore = (store, newTransaction) => {
  // Update month stats
  let months;
  if ((months = store.getData(fetchMonthsQueryName))) {
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

  // Add new to day transactions
  let storedTransactions;
  const { dayStr } = getDateStrings(newTransaction.date);
  storedTransactions = store.getData(fetchTransactionsQueryName, {
    dayStr
  });

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
};
