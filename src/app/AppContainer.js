import React from "react";
import { BrowserRouter, Route } from "react-router-dom";
import { Transactions, NavBar, Form } from "./app-container";
import style from "./AppContainer.module.css";

const AppContainer = () => (
  <BrowserRouter>
    <Route
      path="/"
      render={({ history }) => (
        <div className={style.container}>
          <div className={style.content}>
            <Route path="/" exact component={Transactions} />
            <Route path="/form" component={Form} />
          </div>
          <NavBar className={style.navBar} history={history} />
        </div>
      )}
    />
  </BrowserRouter>
);

export default AppContainer;
