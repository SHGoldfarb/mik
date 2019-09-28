import React from "react";
import PropTypes from "prop-types";
import style from "./Card.module.scss";
import { classnames } from "../utils";
import Clickable from "./Clickable";

const Card = ({ children, header, leftHeader, className, onHeaderClick }) => (
  <div className={classnames(style.container, className)}>
    <Clickable className={style.headers} onClick={onHeaderClick}>
      {leftHeader && <div className={style.leftHeader}>{leftHeader}</div>}
      {header && <div className={style.header}>{header}</div>}
    </Clickable>
    <div>{children}</div>
  </div>
);

Card.defaultProps = {
  header: null,
  children: null,
  leftHeader: null,
  className: "",
  onHeaderClick: () => {}
};

Card.propTypes = {
  children: PropTypes.node,
  header: PropTypes.node,
  leftHeader: PropTypes.node,
  className: PropTypes.string,
  onHeaderClick: PropTypes.func
};

export default Card;
