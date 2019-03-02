import React from "react";

const Clickable = ({ children, ...rest }) => <div {...rest}>{children}</div>;

export default Clickable;
