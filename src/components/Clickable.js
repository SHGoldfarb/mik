import React from "react";
import PropTypes from "prop-types";

const Clickable = ({ children, ...rest }) => <div {...rest}>{children}</div>;

Clickable.defaultProps = {
  children: null
};

Clickable.propTypes = {
  children: PropTypes.node
};

export default Clickable;
