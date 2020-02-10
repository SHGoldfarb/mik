import React from "react";
import { string } from "prop-types";
import I18N from "../../../config/I18N";
import Button from "../../../components/Button";
import { pushForm, pushImport } from "../../../utils/navigation";
import { useHistory } from "../../utils";
import { classnames } from "../../../utils";
import style from "./NavBar.module.scss";

const NavBar = ({ className }) => {
  const history = useHistory();

  return (
    <div className={classnames(className, style.container)}>
      <Button onClick={() => pushForm(history)}>+</Button>
      <Button onClick={() => pushImport(history)}>{I18N.configuration}</Button>
    </div>
  );
};

NavBar.defaultProps = {
  className: ""
};

NavBar.propTypes = {
  className: string
};

export default NavBar;
