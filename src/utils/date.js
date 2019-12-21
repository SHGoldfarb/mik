import I18N from "../config/I18N";

// Returns a date object parsing the string in UTC-0

export const inCurrentTZ = dateStr =>
  new Date(
    new Date(dateStr).getTime() + new Date(dateStr).getTimezoneOffset() * 60000
  );

const twoDigits = n => `${n}`.padStart(2, "0");

export const prettyMonth = date =>
  `${I18N.date.months[date.getMonth()]} - ${date.getFullYear()}`;

export const getDateStrings = date => {
  const dateObject = new Date(date);
  const day = twoDigits(dateObject.getDate());
  const month = twoDigits(dateObject.getMonth() + 1);
  const year = dateObject.getFullYear();
  const monthStr = `${year}-${month}`;
  const dayStr = `${monthStr}-${day}`;
  return { monthStr, dayStr };
};

export const toISOStringInCurrentTZ = (date = new Date()) =>
  new Date(date - new Date().getTimezoneOffset() * 60 * 1000).toISOString();

export const isValidDate = date => date instanceof Date && !isNaN(date);
