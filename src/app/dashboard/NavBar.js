import React from "react";
import PropTypes from "prop-types";
import style from "./NavBar.module.css";
import { Button } from "../../components";
import { dictionary } from "../../config";
import { classnames } from "../../utils";

const NavBar = ({ className, history }) => (
  <div className={classnames(style.navBar, className)}>
    <Button className={style.button} onClick={() => history.push("/")}>
      {dictionary.transactions}
    </Button>
    <Button className={style.button} onClick={() => history.push("/form")}>
      {dictionary.form}
    </Button>
  </div>
);

NavBar.defaultProps = {
  className: ""
};

NavBar.propTypes = {
  history: PropTypes.shape({ push: PropTypes.func.isRequired }).isRequired,
  className: PropTypes.string
};

export default NavBar;
