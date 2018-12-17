import {
  QUANTITY,
  MULTIPLIER,
  CASH,
  EXPENSE,
  INCOME
} from "../utils/constants";

const randBool = () => Math.random() < 0.5;

const createTransaction = (amount, date, type) => ({
  amount,
  date,
  account: CASH,
  type
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

const generateTransactions = number => {
  const transactions = [];
  let total = 0;
  for (let i = 0; i < number; i += 1) {
    const tooMuch = 1 / Math.random() < Math.abs(total);
    const doExpense = randBool();
    if ((tooMuch && total > 0) || doExpense) {
      // Expense
      const amount = randomAmount(QUANTITY);
      transactions.push(expense(amount, i));
      total -= amount;
    } else {
      // Income
      const amount = randomAmount(QUANTITY);
      transactions.push(income(amount, i));
      total += amount;
    }
  }
  return transactions;
};

export default generateTransactions;
