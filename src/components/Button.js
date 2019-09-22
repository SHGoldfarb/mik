import React from "react";
import PropTypes from "prop-types";
import { classnames } from "../utils";
import style from "./Button.module.scss";

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

Button.defaultProps = {
  children: null,
  onClick: () => {},
  className: ""
};

Button.propTypes = {
  children: PropTypes.node,
  onClick: PropTypes.func,
  className: PropTypes.string
};

export default Button;
