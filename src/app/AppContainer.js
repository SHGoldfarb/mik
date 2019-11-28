import React from "react";
import { BrowserRouter, Route } from "react-router-dom";
import { Transactions, FormOld, Form } from "./app-container";
import style from "./AppContainer.module.css";

const AppContainer = () => (
  <BrowserRouter>
    <Route
      path="/"
      render={() => (
        <div className={style.container}>
          <Route path="/" exact component={Transactions} />
          <Route path="/form" component={FormOld} />
          <Route path="/forms" component={Form} />
        </div>
      )}
    />
  </BrowserRouter>
);

export default AppContainer;
