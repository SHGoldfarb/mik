import { EXPENSE, INCOME, CASH } from "../utils/constants";
import uniques from "../utils/uniques";

const QUANTITY = 10000000;
const MULTIPLIER = 100;

const mockText =
  "Cookies for birthday. Coca-cola. Health insurance. Christmas gift. I was hungry. Food for the week. Monthly groceries. Going out with friends. A table for the dining room.";

const msTimezone = 1000 * 60 * 60 * 3;

const msDay = 1000 * 60 * 60 * 24;

const msYear2000 = msDay * (365 * 30 + 7) + msTimezone;

const randBool = () => Math.random() < 0.5;

const randInt = (max = 10000) => Math.floor(Math.random() * max);

const sample = items => items[Math.floor(Math.random() * items.length)];

const mockTag = () =>
  sample(
    "drinks food health insurance coca-cola pepsi macdonalds burgerking education school cellphone services internet park friends unexpected expenses food groceries sugar dessert sports".split(
      " "
    )
  );

const mockComment = () => {
  // select length of comment
  const nChars = Math.round(Math.random() * 25) + 5;

  // select start position
  let startIndex = Math.random() * (mockText.length - 2 - nChars);
  while (mockText[startIndex] === " ") {
    startIndex = Math.random() * (mockText.length - 2 - nChars);
  }

  return mockText.slice(startIndex, startIndex + nChars);
};

const createTransaction = (amount, date, type) => ({
  amount,
  date,
  account: CASH,
  type,
  comment: mockComment(),
  tags: uniques([...Array(randInt(4))].map(() => mockTag()))
});

const income = (amount, date) => createTransaction(amount, date, INCOME);

const expense = (amount, date) => createTransaction(amount, date, EXPENSE);

const randomAmount = (max = 1, min = 0, multiplier = MULTIPLIER) => {
  if (max === 0) {
    return max;
  }
  let amount = 0;
  while (amount === 0) {
    amount =
      Math.round((Math.random() * (max - min) + min) / multiplier) * multiplier;
  }
  return amount;
};

const hour = 1000 * 60 * 60;

const generateTransactions = number => {
  let currentId = 0;
  const transactions = {};
  let total = 0;
  let currentDate = msYear2000;
  for (let i = 0; i < number; i += 1) {
    const tooMuch = 1 / Math.random() < Math.abs(total);
    const doExpense = randBool();

    currentDate += (1 / Math.random()) * hour * 3;
    if ((tooMuch && total > 0) || doExpense) {
      // Expense
      const amount = randomAmount(QUANTITY);
      transactions[currentId] = expense(amount, currentDate);
      total -= amount;
    } else {
      // Income
      const amount = randomAmount(QUANTITY);
      transactions[currentId] = income(amount, currentDate);
      total += amount;
    }
    currentId += 1;
  }
  return transactions;
};

export const generateTransactionsArray = number => {
  const transactions = generateTransactions(number);
  return Object.keys(transactions).map(id => ({
    ...transactions[id],
    id: parseInt(id, 10)
  }));
};

export default generateTransactions;
