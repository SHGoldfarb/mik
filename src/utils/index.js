export const classnames = (...classes) => {
  let str = "";
  for (let i = 0; i < classes.length; i += 1) {
    str = `${str} ${classes[i]}`;
  }
  return str;
};

export const toMoneyString = amount => {
  let strAmount = amount.toString();
  let s = "";
  while (strAmount.length > 0) {
    s = `${strAmount.slice(Math.max(strAmount.length - 3, 0))}.${s}`;
    strAmount = strAmount.slice(0, Math.max(strAmount.length - 3, 0));
  }
  return `$${s.slice(0, s.length - 1)}`;
};
