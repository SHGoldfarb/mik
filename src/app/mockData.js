const QUANTITY = 10000;
const MULTIPLIER = 100;
const CASH = "CASH";
const EXPENSE = "EXPENSE";
const INCOME = "INCOME";

const randBool = () => Math.random() < 0.5;

const income = (amount, date) => ({
  amount,
  date,
  account: CASH,
  type: INCOME
});

const expense = (amount, date) => ({
  amount,
  date,
  account: CASH,
  type: EXPENSE
});

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
