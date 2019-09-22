import React from "react";
import PropTypes from "prop-types";
import style from "./NavBar.module.css";
import { I18N } from "../../config";
import { classnames } from "../../utils";
import Button from "../../components/Button";
import { pushHome, pushForm } from "../../utils/navigation";

const NavBar = ({ className, history }) => (
  <div className={classnames(style.navBar, className)}>
    <Button className={style.button} onClick={() => pushHome(history)}>
      {I18N.transactions}
    </Button>
    <Button className={style.button} onClick={() => pushForm(history)}>
      {I18N.form}
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
