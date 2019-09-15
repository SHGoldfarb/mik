import React from "react";
import PropTypes from "prop-types";
import style from "./Card.module.scss";

const Card = ({ children, header, leftHeader }) => (
  <div className={style.container}>
    <div className={style.headers}>
      {leftHeader}
      {header}
    </div>
    <div>{children}</div>
  </div>
);

Card.defaultProps = {
  header: null,
  children: null,
  leftHeader: null
};

Card.propTypes = {
  children: PropTypes.node,
  header: PropTypes.node,
  leftHeader: PropTypes.node
};

export default Card;
