import React from "react";
import PropTypes from "prop-types";
import style from "./Card.module.scss";
import { classnames } from "../utils";

const Card = ({ children, header, leftHeader, className }) => (
  <div className={classnames(style.container, className)}>
    <div className={style.headers}>
      {leftHeader && <div className={style.leftHeader}>{leftHeader}</div>}
      {header && <div className={style.header}>{header}</div>}
    </div>
    <div>{children}</div>
  </div>
);

Card.defaultProps = {
  header: null,
  children: null,
  leftHeader: null,
  className: ""
};

Card.propTypes = {
  children: PropTypes.node,
  header: PropTypes.node,
  leftHeader: PropTypes.node,
  className: PropTypes.string
};

export default Card;
