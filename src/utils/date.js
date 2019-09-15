import I18N from "../config/dictionary";

// Returns a date object parsing the string in UTC-0

export const inCurrentTZ = dateStr =>
  new Date(
    new Date(dateStr).getTime() + new Date().getTimezoneOffset() * 60000
  );

export const prettyMonth = date =>
  `${I18N.date.months[date.getMonth()]} - ${date.getFullYear()}`;
