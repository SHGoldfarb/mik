import React from "react";
import PropTypes from "prop-types";
import style from "./NavBar.module.css";
import { Button } from "../../components";
import { dictionary } from "../../config";

const NavBar = ({ onShowTransactions, onShowForm, className }) => (
  <div className={className}>
    <Button className={style.button} onClick={onShowTransactions}>
      {dictionary.dashboard}
    </Button>
    <Button className={style.button} onClick={onShowForm}>
      {dictionary.form}
    </Button>
  </div>
);

NavBar.defaultProps = {
  className: ""
};

NavBar.propTypes = {
  onShowTransactions: PropTypes.func.isRequired,
  onShowForm: PropTypes.func.isRequired,
  className: PropTypes.string
};

export default NavBar;
