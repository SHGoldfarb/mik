import React from "react";
import PropTypes from "prop-types";
import style from "./PrettyDate.module.scss";

const PrettyDate = ({ dateHighlight, dateNormal }) => (
  <div className={style.container}>
    <div className={style.highlight}>{dateHighlight}</div>
    <div className={style.normal}>{dateNormal}</div>
  </div>
);

PrettyDate.defaultProps = {
  dateHighlight: "",
  dateNormal: ""
};

PrettyDate.propTypes = {
  dateHighlight: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  dateNormal: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};

export default PrettyDate;
