// eslint-disable-next-line import/prefer-default-export
export const selectAllTransactions = state =>
  state.transactions
    ? Object.values(state.transactions).sort((a, b) => -a.date + b.date)
    : [];
