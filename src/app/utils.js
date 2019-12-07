import React, { createContext } from "react";
import { historyPropType } from "../utils/propTypes";

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
