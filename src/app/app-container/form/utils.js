import { getDateStrings } from "../../../utils/date";

export const goToTransactionsView = (history, date) =>
  history.push(`/?active=${getDateStrings(date).monthStr}`);
