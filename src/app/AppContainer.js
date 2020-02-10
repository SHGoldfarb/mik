import React from "react";
import { BrowserRouter, Route } from "react-router-dom";
import { Transactions, Form, Import } from "./app-container";
import style from "./AppContainer.module.css";
import { withAppContainerContext } from "./utils";

const AppContainer = () => (
  <BrowserRouter>
    <Route
      path="/"
      render={() => (
        <div className={style.container}>
          <Route
            path="/"
            exact
            component={withAppContainerContext(Transactions)}
          />
          <Route path="/form" component={withAppContainerContext(Form)} />
          <Route path="/import" component={withAppContainerContext(Import)} />
        </div>
      )}
    />
  </BrowserRouter>
);

export default AppContainer;
