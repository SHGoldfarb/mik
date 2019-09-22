import React, { forwardRef } from "react";
import PropTypes from "prop-types";
import style from "./Input.module.scss";
import { classnames } from "../utils";

const Input = forwardRef(
  ({ id, label, className, inputClassName, children, ...rest }, ref) => (
    <label className={classnames(style.label, className)} htmlFor={id}>
      {label}
      <input
        className={classnames(style.input, inputClassName)}
        id={id}
        ref={ref}
        {...rest}
      />
      {children}
    </label>
  )
);

Input.defaultProps = {
  id: `${Math.random()}`,
  label: "",
  className: "",
  inputClassName: "",
  children: null
};

Input.propTypes = {
  id: PropTypes.string,
  label: PropTypes.string,
  className: PropTypes.string,
  inputClassName: PropTypes.string,
  children: PropTypes.node
};

export default Input;
