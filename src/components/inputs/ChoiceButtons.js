import React from "react";
import { arrayOf, string, func } from "prop-types";
import { classnames } from "../../utils";
import UnstyledButton from "../UnstyledButton";
import style from "./ChoiceButtons.module.scss";

const ChoiceButtons = ({ source, value, onChange, className }) => (
  <div className={classnames(style.container, className)}>
    {source.map(option => (
      <UnstyledButton
        onClick={() => onChange(option)}
        className={classnames(
          style.button,
          option === value ? style.active : ""
        )}
        key={option}
      >
        {option}
      </UnstyledButton>
    ))}
  </div>
);

ChoiceButtons.defaultProps = {
  value: null,
  className: ""
};

ChoiceButtons.propTypes = {
  source: arrayOf(string).isRequired,
  value: string,
  onChange: func.isRequired,
  className: string
};

export default ChoiceButtons;
