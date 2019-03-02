// eslint-disable-next-line import/prefer-default-export
export const locationParams = history => {
  const { search } = history.location;
  const paramsString = search.split("?")[1];
  if (!paramsString) return {};
  const params = {};
  paramsString.split("&").forEach(param => {
    const [key, value] = param.split("=");
    params[key] = value;
  });
  return params;
};
