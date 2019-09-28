import React from "react";
import style from "./Spinner.module.scss";

const Spinner = () => (
  <div className={style.spinnerContainer}>
    <div className={style.spinner} />
  </div>
);

export default Spinner;
