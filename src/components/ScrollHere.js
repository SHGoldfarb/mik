import React, { useRef, useEffect } from "react";
import { node, bool } from "prop-types";

const scrollToRef = async ref =>
  window.scrollTo(0, ref.current.scrollIntoView());

const ScrollHere = ({ children, condition }) => {
  const myRef = useRef(null);

  useEffect(() => {
    if (condition) {
      scrollToRef(myRef);
    }
  }, [condition]);

  return <div ref={myRef}>{children}</div>;
};

ScrollHere.defaultProps = {
  children: null,
  condition: false
};

ScrollHere.propTypes = {
  children: node,
  condition: bool
};

export default ScrollHere;
