import React, { createContext, useContext } from "react";
import { historyPropType } from "../utils/validators";
import { getUrlParam, updateUrlParam, PUSH } from "../utils/navigation";

export const AppContainerContext = createContext({});

export const withAppContainerContext = Target => {
  const TargetWithProvider = ({ history, ...props }) => (
    <AppContainerContext.Provider value={{ history }}>
      <Target history={history} {...props} />
    </AppContainerContext.Provider>
  );

  TargetWithProvider.propTypes = { history: historyPropType.isRequired };

  return TargetWithProvider;
};

export const useHistory = () => {
  const { history } = useContext(AppContainerContext);
  return history;
};

export const useHistoryParam = (
  fieldName,
  { method: defaultMethod = PUSH } = {}
) => {
  const history = useHistory();
  const currentValue = getUrlParam(history, fieldName);
  const setValue = (newValue, { method = defaultMethod } = {}) =>
    updateUrlParam(history, fieldName, newValue, { method });
  return [currentValue, setValue];
};
