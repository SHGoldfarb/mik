import { openDB } from "idb";
import { getDateStrings, inCurrentTZ } from "../utils/date";
import uniques from "../utils/uniques";
import { getIncomeExpenses, getIncomeExpense } from "../utils/stats";
import flatten from "../utils/flatten";

const DB_NAME = "mik_dabatabase";
const TRANSACTIONS_OBJECT_STORE = "transactions";

const safe = action => (...args) => {
  if (!("indexedDB" in window)) {
    // eslint-disable-next-line no-console
    console.error("This browser doesn't support IndexedDB");
    return undefined;
  }
  return action(...args);
};

const openDatabase = safe(() =>
  openDB(DB_NAME, 1, {
    upgrade(db, oldVersion) {
      // eslint-disable-next-line no-console
      console.log(`UPDATING DB VERSION ${oldVersion}`);
      switch (oldVersion) {
        case 0: {
          const store = db.createObjectStore(TRANSACTIONS_OBJECT_STORE, {
            keyPath: "id",
            autoIncrement: true
          });
          store.createIndex("date", "date");
        }
        // falls through
        default:
        // default does nothing
      }
    },
    blocked() {
      // …
    },
    blocking() {
      // …
    }
  })
);

export const dbSetTransactions = async generateTransactions => {
  const db = await openDatabase();

  const tx = db.transaction(TRANSACTIONS_OBJECT_STORE, "readwrite");

  if ((await tx.store.getAllKeys()).length === 0) {
    // eslint-disable-next-line no-console
    console.log("Adding mock data");
    generateTransactions().forEach(transaction => tx.store.add(transaction));
  }

  return tx.done;
};

export const dbCreateTransaction = async transaction => {
  const db = await openDatabase();
  const tx = db.transaction(TRANSACTIONS_OBJECT_STORE, "readwrite");
  tx.store.add(transaction);
  await tx.done;
  return transaction;
};

export const dbDeleteTransaction = async id => {
  const db = await openDatabase();
  const tx = db.transaction(TRANSACTIONS_OBJECT_STORE, "readwrite");
  const transaction = await tx.store.get(id);
  tx.store.delete(id);
  await tx.done;
  return transaction;
};

export const dbFetchTransaction = async id => {
  const db = await openDatabase();
  const tx = db.transaction(TRANSACTIONS_OBJECT_STORE, "readonly");
  const transaction = await tx.store.get(id);
  await tx.done;
  return transaction;
};

export const dbGenerateAllTransactions = async () => {
  const db = await openDatabase();

  const tx = db.transaction(TRANSACTIONS_OBJECT_STORE, "readonly");
  const index = tx.store.index("date");

  let cursor;

  const nextTransaction = async () => {
    try {
      if (cursor) {
        await cursor.continue();
      } else {
        cursor = await index.openCursor(undefined, "prev");
      }
    } catch {
      return undefined;
    }

    return { ...cursor.value };
  };

  return nextTransaction;
};

export const dbFetchAllTransactions = async () => {
  const db = await openDatabase();
  return db.getAllFromIndex(TRANSACTIONS_OBJECT_STORE, "date");
};

export const dbGenerateAllTags = async () => {
  const nextTransaction = await dbGenerateAllTransactions();

  const sentTags = new Set();

  const unsentTags = new Set();
  const nextTag = async () => {
    while (unsentTags.size === 0) {
      // eslint-disable-next-line no-await-in-loop
      const transaction = await nextTransaction();
      if (transaction === undefined) {
        return undefined;
      }
      transaction.tags.forEach(tag => {
        if (!sentTags.has(tag)) {
          unsentTags.add(tag);
        }
      });
    }

    const tagToSend = [...unsentTags][0];
    unsentTags.delete(tagToSend);
    sentTags.add(tagToSend);
    return tagToSend;
  };

  return nextTag;
};

export const dbFetchAllTags = async () => {
  const tags = [];
  const nextTag = await dbGenerateAllTags();

  let tag = await nextTag();

  while (tag !== undefined) {
    tags.push(tag);
    // eslint-disable-next-line no-await-in-loop
    tag = await nextTag();
  }
  return tags;
};

export const dbGenerateAllMonths = async () => {
  const nextTransaction = await dbGenerateAllTransactions();

  const months = new Set();

  const nextMonth = async () => {
    const transaction = await nextTransaction();

    if (transaction === undefined) {
      return undefined;
    }

    const { monthStr } = getDateStrings(transaction.date);
    if (!months.has(monthStr)) {
      months.add(monthStr);
      return monthStr;
    }
    return nextMonth();
  };

  return nextMonth;
};

export const dbFetchAllMonths = async () => {
  const transactions = await dbFetchAllTransactions();
  const monthStrings = transactions.map(
    transaction => getDateStrings(transaction.date).monthStr
  );
  return uniques(monthStrings).sort((a, b) => (a < b ? -1 : 1));
};

const getTransactionsInDateRange = async (start, end) => {
  const db = await openDatabase();
  const range = IDBKeyRange.bound(start.getTime(), end.getTime());

  return (await db.getAllFromIndex(
    TRANSACTIONS_OBJECT_STORE,
    "date",
    range
  )).reverse();
};

export const dbFetchMonthTransactions = monthStr => {
  const start = inCurrentTZ(`${monthStr}-01`);
  const end = new Date(start.getFullYear(), start.getMonth() + 1, 0);

  return getTransactionsInDateRange(start, end);
};

export const dbFetchDayTransactions = dayStr => {
  const start = inCurrentTZ(dayStr);
  const end = new Date(start.getTime() + 1000 * 60 * 60 * 24 - 1);

  return getTransactionsInDateRange(start, end);
};

export const dbFetchMonthStats = async monthStr => {
  const transactions = await dbFetchMonthTransactions(monthStr);

  return getIncomeExpenses(transactions);
};

export const dbFetchDayStats = async dayStr => {
  const transactions = await dbFetchDayTransactions(dayStr);

  return getIncomeExpenses(transactions);
};

export const dbFetchMonthDays = async monthStr => {
  const transactions = await dbFetchMonthTransactions(monthStr);

  const days = [
    ...transactions.reduce((acc, transaction) => {
      const { dayStr } = getDateStrings(transaction.date);
      return !acc.has(dayStr) ? acc.add(dayStr) : acc;
    }, new Set())
  ];

  return days;
};

export const dbApiFetchMonths = async () => {
  const transactions = await dbFetchAllTransactions();
  return transactions.reduce((acc, transaction) => {
    const { monthStr } = getDateStrings(transaction.date);
    if (!acc[monthStr]) {
      acc[monthStr] = { income: 0, expense: 0 };
    }
    const { income, expense } = getIncomeExpense(transaction);
    acc[monthStr].income += income;
    acc[monthStr].expense += expense;
    return acc;
  }, {});
};

export const dbApiFetchDays = async ({ monthStr = null } = {}) => {
  const transactions = monthStr
    ? await dbFetchMonthTransactions(monthStr)
    : await dbFetchAllTransactions();

  const days = [
    ...transactions.reduce((acc, transaction) => {
      const { dayStr } = getDateStrings(transaction.date);
      return !acc.has(dayStr) ? acc.add(dayStr) : acc;
    }, new Set())
  ];

  return days;
};

export const dbApiFetchTransactions = ({
  monthStr = null,
  dayStr = null
} = {}) =>
  // TODO: ensure this is fetched in order: by date descending
  (monthStr && dbFetchMonthTransactions(monthStr)) ||
  (dayStr && dbFetchDayTransactions(dayStr)) ||
  dbFetchAllTransactions();

export const dbApiFetchTransaction = async ({ id }) => {
  if (!id) {
    return undefined;
  }
  const db = await openDatabase();
  const tx = db.transaction(TRANSACTIONS_OBJECT_STORE, "readonly");
  const transaction = await tx.store.get(id);
  await tx.done;
  return transaction;
};

export const dbApiFetchTagsInstantly = async () => {
  const transactions = await dbApiFetchTransactions();
  return uniques(flatten(transactions.map(transaction => transaction.tags)));
};

export const dbApiFetchTags = async () => {
  const tags = [];
  const nextTag = await dbGenerateAllTags();

  let tag = await nextTag();

  while (tag !== undefined) {
    tags.push(tag);
    // eslint-disable-next-line no-await-in-loop
    tag = await nextTag();
  }
  return tags;
};
