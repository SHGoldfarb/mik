import { useState } from "react";

const State = ({ initialState, children }) => {
  const [state, setState] = useState(initialState);
  return children(state, setState);
};

export default State;
