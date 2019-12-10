import React, { forwardRef } from "react";
import PropTypes from "prop-types";
import style from "./Input.module.scss";
import inputStyle from "./style.module.scss";
import { classnames } from "../../utils";
import { randInt } from "../../utils/radom";

const datalistId = `${randInt(10000000000)} datalistId`;

const Input = forwardRef(
  (
    {
      id,
      label,
      className,
      inputClassName,
      children,
      onChange,
      datalist,
      ...rest
    },
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
        list={datalist ? datalistId : undefined}
        {...rest}
      />
      {datalist && (
        <datalist id={datalistId}>
          {Object.keys(datalist).map(key => (
            <option key={key} value={key}>
              {datalist[key]}
            </option>
          ))}
        </datalist>
      )}
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
  onChange: () => {},
  datalist: null
};

Input.propTypes = {
  id: PropTypes.string,
  label: PropTypes.string,
  className: PropTypes.string,
  inputClassName: PropTypes.string,
  children: PropTypes.node,
  onChange: PropTypes.func,
  datalist: PropTypes.objectOf(PropTypes.string)
};

export default Input;
