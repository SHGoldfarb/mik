import React from "react";
import { string, func } from "prop-types";
import { EXPENSE, INCOME } from "../../../utils/constants";
import ChoiceButtons from "../../../components/inputs/ChoiceButtons";

const TYPES = [EXPENSE, INCOME];

const TypeInput = ({ value, onChange }) => (
  <ChoiceButtons source={TYPES} value={value} onChange={onChange} />
);

TypeInput.defaultProps = {
  value: null
};

TypeInput.propTypes = {
  value: string,
  onChange: func.isRequired
};

export default TypeInput;
