// eslint-disable-next-line import/prefer-default-export
export const selectAllTransactions = state =>
  state.transactions ? state.transactions : [];
