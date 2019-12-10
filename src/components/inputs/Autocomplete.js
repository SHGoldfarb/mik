import React, { useState, Fragment } from "react";
import { objectOf, arrayOf, string, func } from "prop-types";
import Input from "./Input";
import uniques from "../../utils/uniques";
import Clickable from "../Clickable";

const Autocomplete = ({ source, onChange, value: selectedValues, ...rest }) => {
  const [query, setQuery] = useState("");

  const handleAddValue = newValue => {
    onChange(uniques([...selectedValues, newValue]));
    setQuery("");
  };

  const handleRemoveValue = valueToRemove => {
    onChange(selectedValues.filter(value => value !== valueToRemove));
  };

  const choosableSource = Object.keys(source).reduce((acc, key) => {
    if (selectedValues.includes(key)) {
      return { ...acc };
    }
    return { ...acc, [key]: source[key] };
  }, {});

  return (
    <Fragment>
      <Input
        autoComplete="off"
        value={query}
        onKeyUp={ev => {
          if (ev.which === undefined) {
            // One of the datalist options was clicked on
            ev.preventDefault();
            handleAddValue(ev.target.value);
          }
        }}
        onChange={setQuery}
        onKeyPress={ev => {
          if (ev.key === "Enter") {
            ev.preventDefault();
            handleAddValue(ev.target.value);
          }
        }}
        datalist={choosableSource}
        {...rest}
      />
      {selectedValues.map(value => (
        <Clickable key={value} onClick={() => handleRemoveValue(value)}>
          {source[value] || value}
        </Clickable>
      ))}
    </Fragment>
  );
};

Autocomplete.propTypes = {
  source: objectOf(string).isRequired,
  value: arrayOf(string).isRequired,
  onChange: func.isRequired
};

export default Autocomplete;
