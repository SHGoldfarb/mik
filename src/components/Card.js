import React from "react";
import PropTypes from "prop-types";
import style from "./Card.module.scss";
import { classnames } from "../utils";
import Clickable from "./Clickable";

const Card = ({ children, header, className, onHeaderClick, theme }) => (
  <div className={classnames(style.container, className)}>
    <Clickable
      className={classnames(style.headers, theme.header)}
      onClick={onHeaderClick}
    >
      {header}
    </Clickable>
    {children}
  </div>
);

Card.defaultProps = {
  header: null,
  children: null,
  className: "",
  onHeaderClick: () => {},
  theme: { header: "" }
};

Card.propTypes = {
  children: PropTypes.node,
  header: PropTypes.node,
  className: PropTypes.string,
  onHeaderClick: PropTypes.func,
  theme: PropTypes.shape({ header: PropTypes.string })
};

export default Card;
