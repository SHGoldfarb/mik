import { dbClearTransactions } from "../database/actions";

const commands = {
  __deleteAll__: dbClearTransactions
};

export const executeCommand = async comment => {
  if (Object.keys(commands).includes(comment)) {
    await commands[comment]();
    return true;
  }
  return false;
};
