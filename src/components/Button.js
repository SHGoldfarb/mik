import React from "react";

const Button = ({ children, onClick, ...props }) => {
  const handleClick = ev => onClick(ev);
  return (
    <div
      onClick={handleClick}
      onKeyDown={ev => {
        if (ev.key === "Enter") {
          handleClick(ev);
        }
      }}
      role="button"
      tabIndex={0}
      {...props}
    >
      {children}
    </div>
  );
};

export default Button;
