import React from "react";
import { BrowserRouter, Route } from "react-router-dom";
import { Transactions, NavBar, Form } from "./dashboard";
import style from "./Dashboard.module.css";

const Dashboard = () => (
  <BrowserRouter>
    <div className={style.dashboard}>
      <Route
        path="/"
        render={() => (
          <div className={style.content}>
            <Route path="/" exact component={Transactions} />
            <Route path="/form" component={Form} />
          </div>
        )}
      />
      <Route
        path="/"
        render={({ history }) => (
          <NavBar className={style.navBar} history={history} />
        )}
      />
    </div>
  </BrowserRouter>
);

export default Dashboard;
