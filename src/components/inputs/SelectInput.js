import React, { forwardRef } from "react";
import PropTypes from "prop-types";
import { classnames } from "../../utils";
import style from "./SelectInput.module.scss";
import inputStyle from "./style.module.scss";

const SelectInput = forwardRef(
  (
    { id, label, className, inputClassName, children, options, ...rest },
    ref
  ) => (
    <label
      className={classnames(inputStyle.container, style.label, className)}
      htmlFor={id}
    >
      {label && <div className={inputStyle.label}>{label}</div>}
      <select
        className={classnames(inputStyle.input, style.input, inputClassName)}
        id={id}
        ref={ref}
        {...rest}
      >
        {options.map(value => (
          <option value={value} key={value}>
            {value}
          </option>
        ))}
      </select>
      {children}
    </label>
  )
);

SelectInput.defaultProps = {
  id: `${Math.random()}`,
  label: "",
  className: "",
  inputClassName: "",
  children: null,
  options: []
};

SelectInput.propTypes = {
  id: PropTypes.string,
  label: PropTypes.string,
  className: PropTypes.string,
  inputClassName: PropTypes.string,
  children: PropTypes.node,
  options: PropTypes.arrayOf(PropTypes.string)
};

export default SelectInput;
