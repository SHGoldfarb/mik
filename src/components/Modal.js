import React from "react";
import PropTypes from "prop-types";
import { Button } from ".";
import style from "./Modal.module.css";

const Modal = ({ children, onOverlayClick, active }) => (
  <div className={style.modalContainer}>
    <Button
      className={style.overlay}
      onClick={onOverlayClick}
      style={{ display: active ? "initial" : "none" }}
    />
    <div className={style.box} style={{ display: active ? "initial" : "none" }}>
      {children}
    </div>
  </div>
);

Modal.defaultProps = {
  children: null,
  onOverlayClick: () => {},
  active: false
};

Modal.propTypes = {
  children: PropTypes.node,
  onOverlayClick: PropTypes.func,
  active: PropTypes.bool
};

export default Modal;
