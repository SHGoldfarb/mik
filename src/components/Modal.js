import React from "react";
import PropTypes from "prop-types";
import { Button } from ".";
import style from "./Modal.module.css";
import { classnames } from "../utils";

const Modal = ({ children, onOverlayClick, active }) => (
  <div className={classnames(style.modalContainer, active ? "" : style.hidden)}>
    <Button
      className={classnames(style.overlay, active ? "" : style.hidden)}
      onClick={onOverlayClick}
      style={{ display: active ? "initial" : "none" }}
    />
    <div className={classnames(style.box, active ? "" : style.hidden)}>
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
