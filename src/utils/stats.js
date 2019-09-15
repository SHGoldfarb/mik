import { INCOME, EXPENSE } from "./constants";

export const getIncomeExpense = transaction => {
  const { amount, type } = transaction;
  switch (type) {
    case INCOME:
      return { income: amount, expense: 0 };
    case EXPENSE:
      return { income: 0, expense: amount };
    default:
      throw Error(`Unsupported transaction type ${type}`);
  }
};

export const getIncomeExpenses = transactions =>
  transactions.reduce(
    ({ income: totalIncome, expense: totalExpense }, transaction) => {
      const { income, expense } = getIncomeExpense(transaction);
      return { income: income + totalIncome, expense: expense + totalExpense };
    },
    { income: 0, expense: 0 }
  );

export const getTotal = transactions => {
  const { income, expense } = getIncomeExpenses(transactions);
  return income - expense;
};
