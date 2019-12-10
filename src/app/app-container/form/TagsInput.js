import React from "react";
import { arrayOf, string, func } from "prop-types";
import { useDBApi, fetchTagsQueryName } from "../../../components/DBApi";
import I18N from "../../../config/I18N";
import Autocomplete from "../../../components/inputs/Autocomplete";

const TagsInput = ({ value: tags, onChange }) => {
  const { data, loading } = useDBApi(fetchTagsQueryName);

  const existingTags = data || [];

  return (
    <Autocomplete
      source={existingTags.reduce((acc, tag) => ({ ...acc, [tag]: tag }), {})}
      onChange={onChange}
      value={tags}
      placeholder={loading ? I18N.placeholders.loading_dots : ""}
      disabled={loading}
      label={`${I18N.transaction.tags}:`}
    />
  );
};

TagsInput.propTypes = {
  value: arrayOf(string).isRequired,
  onChange: func.isRequired
};

export default TagsInput;
