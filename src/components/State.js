import { useState } from "react";

const State = ({ initialState, children }) => children(useState(initialState));

export default State;
