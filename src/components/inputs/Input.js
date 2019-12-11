import React from "react";
import PropTypes from "prop-types";
import style from "./Input.module.scss";
import inputStyle from "./style.module.scss";
import { classnames } from "../../utils";
import { randInt } from "../../utils/radom";

const datalistId = `${randInt()} datalistId`;

const Input = ({
  id: receivedId,
  label,
  className,
  inputClassName,
  children,
  onChange,
  datalist,
  inputSibling,
  inputWrapperClassName,
  ...rest
}) => {
  const id = receivedId || randInt();
  return (
    <label
      className={classnames(inputStyle.container, style.label, className)}
      htmlFor={id}
    >
      {label && <div className={inputStyle.label}>{label}</div>}
      <div className={inputWrapperClassName}>
        <input
          className={classnames(inputStyle.input, style.input, inputClassName)}
          id={id}
          onChange={ev => onChange(ev.target.value)}
          list={datalist ? datalistId : undefined}
          {...rest}
        />
        {inputSibling}
      </div>
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
  );
};

Input.defaultProps = {
  id: null,
  label: "",
  className: "",
  inputClassName: "",
  children: null,
  onChange: () => {},
  datalist: null,
  inputSibling: null,
  inputWrapperClassName: ""
};

Input.propTypes = {
  id: PropTypes.string,
  label: PropTypes.string,
  className: PropTypes.string,
  inputClassName: PropTypes.string,
  children: PropTypes.node,
  onChange: PropTypes.func,
  datalist: PropTypes.objectOf(PropTypes.string),
  inputSibling: PropTypes.node,
  inputWrapperClassName: PropTypes.string
};

export default Input;
