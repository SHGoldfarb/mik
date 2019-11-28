import React from "react";
import { string } from "prop-types";
import { classnames } from "../utils";
import style from "./UnstyledButton.module.scss";

const UnstyledButton = ({ className, ...rest }) => (
  <button
    className={classnames(className, style.unstyled)}
    type="button"
    {...rest}
  />
);

UnstyledButton.defaultProps = {
  className: ""
};

UnstyledButton.propTypes = {
  className: string
};

export default UnstyledButton;
