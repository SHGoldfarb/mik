export const home = "/";
export const form = `${home}form/`;
export const importPath = `${home}import/`;

export const PUSH = "PUSH";
export const REPLACE = "REPLACE";

const getSearchFromParams = params => {
  const searchStr = Object.keys(params).reduce((acc, key) => {
    let s = "";
    if (acc.length === 0) {
      s += "?";
    } else {
      s += "&";
    }
    s += `${key}=${params[key]}`;

    return `${acc}${s}`;
  }, "");

  return searchStr;
};

export const pushHome = (history, params = {}) =>
  history.push(`${home}${getSearchFromParams(params)}`);

export const pushForm = (history, params = {}) =>
  history.push(`${form}${getSearchFromParams(params)}`);

export const pushImport = (history, params = {}) =>
  history.push(`${importPath}${getSearchFromParams(params)}`);

const getParamsFromSearch = searchStr => {
  if (searchStr.length === 0) {
    return {};
  }
  const params = searchStr.split("?")[1].split("&");
  return params.reduce((acc, param) => {
    const [key, value] = param.split("=");
    return { ...acc, [key]: value };
  }, {});
};

const getUrlParams = history => getParamsFromSearch(history.location.search);

export const getUrlParam = (history, field) => getUrlParams(history)[field];

const getNewUrl = (history, params) => {
  const searchStr = getSearchFromParams(params);

  return `${history.location.pathname}${searchStr}`;
};

const replaceUrlParams = (history, params) =>
  history.replace(getNewUrl(history, params));

const pushUrlParams = (history, params) =>
  history.push(getNewUrl(history, params));

export const setUrlParams = (history, { params = {}, method = PUSH } = {}) =>
  method === PUSH
    ? pushUrlParams(history, params)
    : replaceUrlParams(history, params);

const mergeUrlParams = (history, params) => {
  const oldParams = getUrlParams(history);
  Object.keys(params).forEach(key => {
    oldParams[key] = params[key];
  });
  return oldParams;
};

export const upsertReplaceUrlParams = (history, params) => {
  const newParams = mergeUrlParams(history, params);
  replaceUrlParams(history, newParams);
};

export const upsertPushUrlParams = (history, params) => {
  const newParams = mergeUrlParams(history, params);
  pushUrlParams(history, newParams);
};

export const upsertUrlParams = (history, { params = {}, method = PUSH } = {}) =>
  method === PUSH
    ? upsertPushUrlParams(history, params)
    : upsertReplaceUrlParams(history, params);

export const updateUrlParam = (
  history,
  fieldName,
  value,
  { method = PUSH } = {}
) => {
  const params = { [fieldName]: value };
  return upsertUrlParams(history, { params, method });
};
