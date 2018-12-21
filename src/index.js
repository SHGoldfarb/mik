import React from "react";
import ReactDOM from "react-dom";
import { createStore, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import { rootReducer } from "./redux/reducers";
import { KEY } from "./utils/constants";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";

const persister = store => next => action => {
  const result = next(action);
  const state = store.getState();
  localStorage.setItem(KEY, JSON.stringify(state));
  return result;
};

const store = createStore(rootReducer, applyMiddleware(persister));

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
