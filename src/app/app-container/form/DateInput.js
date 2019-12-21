import React from "react";
import { func, instanceOf } from "prop-types";
import Input from "../../../components/inputs/Input";
import { I18N } from "../../../config";
import { toISOStringInCurrentTZ, isValidDate } from "../../../utils/date";

const DateInput = ({ value, onChange, ...rest }) => (
  <Input
    label={`${I18N.transaction.date}:`}
    type="datetime-local"
    onChange={newValue => onChange(new Date(newValue))}
    value={
      value && isValidDate(value)
        ? toISOStringInCurrentTZ(value).split(".")[0]
        : ""
    }
    {...rest}
  />
);

DateInput.defaultProps = {
  value: null
};

DateInput.propTypes = {
  value: instanceOf(Date),
  onChange: func.isRequired
};

export default DateInput;
