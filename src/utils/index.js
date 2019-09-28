export const classnames = (...classes) => {
  let str = "";
  for (let i = 0; i < classes.length; i += 1) {
    str = `${str} ${classes[i]}`;
  }
  return str;
};

export const prettyCurrency = amount => {
  let strAmount = amount.toString();
  if (strAmount[0] === "-") {
    strAmount = strAmount.slice(1, strAmount.length);
  }
  let s = "";
  while (strAmount.length > 0) {
    s = `${strAmount.slice(Math.max(strAmount.length - 3, 0))}.${s}`;
    strAmount = strAmount.slice(0, Math.max(strAmount.length - 3, 0));
  }
  if (amount < 0) {
    s = `-${s}`;
  }
  return `$${s.slice(0, s.length - 1)}`;
};

export const compose = (...funcs) => value =>
  funcs.reduceRight((val, f) => f(val), value);
