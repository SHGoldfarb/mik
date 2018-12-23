import React from "react";

const Button = ({ children, onClick, ...props }) => (
  <div
    onClick={onClick}
    onKeyDown={ev => {
      if (ev.key === "Enter") {
        onClick(ev);
      }
    }}
    role="button"
    tabIndex={0}
    {...props}
  >
    {children}
  </div>
);

export default Button;
