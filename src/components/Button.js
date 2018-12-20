import React from "react";

const Button = ({ children, onClick, ...props }) => (
  <div
    onClick={onClick}
    onKeyUp={() => {}}
    role="button"
    tabIndex={0}
    {...props}
  >
    {children}
  </div>
);

export default Button;
