import { openDB } from "idb";
import { getDateStrings, inCurrentTZ } from "../utils/date";
import uniques from "../utils/uniques";
import { getIncomeExpenses } from "../utils/stats";

const DB_NAME = "mik_dabatabase";
const TRANSACTIONS_OBJECT_STORE = "transactions";

const safe = action => (...args) => {
  if (!("indexedDB" in window)) {
    // eslint-disable-next-line no-console
    console.log("This browser doesn't support IndexedDB");
    return undefined;
  }
  return action(...args);
};

const openDatabase = () =>
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
  });

export const dbSetTransactions = safe(async transactions => {
  const db = await openDatabase();

  const tx = db.transaction(TRANSACTIONS_OBJECT_STORE, "readwrite");

  if ((await tx.store.getAllKeys()).length === 0) {
    // eslint-disable-next-line no-console
    console.log("Adding mock data");
    transactions.forEach(transaction => tx.store.add(transaction));
  }

  return tx.done;
});

export const dbFetchAllTransactions = async () => {
  const db = await openDatabase();
  return db.getAllFromIndex(TRANSACTIONS_OBJECT_STORE, "date");
};

export const dbGenerateAllMonths = async () => {
  const db = await openDatabase();

  const tx = db.transaction(TRANSACTIONS_OBJECT_STORE, "readonly");
  const index = tx.store.index("date");

  const cursor = await index.openCursor();

  const months = new Set();

  const nextMonth = async () => {
    try {
      await cursor.continue();
    } catch {
      return undefined;
    }

    const transaction = { ...cursor.value };
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

export const dbFetchMonthTransactions = async monthStr => {
  const db = await openDatabase();

  const start = inCurrentTZ(`${monthStr}-01`);
  const end = new Date(start.getFullYear(), start.getMonth() + 1, 0);

  const range = IDBKeyRange.bound(start.getTime(), end.getTime());

  return db.getAllFromIndex(TRANSACTIONS_OBJECT_STORE, "date", range);
};

export const dbFetchMonthStats = async monthStr => {
  const transactions = await dbFetchMonthTransactions(monthStr);

  return getIncomeExpenses(transactions);
};
