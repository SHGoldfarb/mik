import React, { forwardRef } from "react";
import PropTypes from "prop-types";
import style from "./Input.module.scss";
import inputStyle from "./style.module.scss";
import { classnames } from "../../utils";

const Input = forwardRef(
  (
    { id, label, className, inputClassName, children, onChange, ...rest },
    ref
  ) => (
    <label
      className={classnames(inputStyle.container, style.label, className)}
      htmlFor={id}
    >
      {label && <div className={inputStyle.label}>{label}</div>}
      <input
        className={classnames(inputStyle.input, style.input, inputClassName)}
        id={id}
        ref={ref}
        onChange={ev => onChange(ev.target.value)}
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
  children: null,
  onChange: () => {}
};

Input.propTypes = {
  id: PropTypes.string,
  label: PropTypes.string,
  className: PropTypes.string,
  inputClassName: PropTypes.string,
  children: PropTypes.node,
  onChange: PropTypes.func
};

export default Input;
