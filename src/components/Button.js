import React from "react";
import { classnames } from "../utils";
import style from "./Button.module.css";

const Button = ({ children, onClick, className, ...props }) => (
  <div
    onClick={onClick}
    onKeyDown={ev => {
      if (ev.key === "Enter") {
        onClick(ev);
      }
    }}
    role="button"
    tabIndex={0}
    className={classnames(style.button, className)}
    {...props}
  >
    {children}
  </div>
);

export default Button;
