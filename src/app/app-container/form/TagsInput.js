import React, { useState, Fragment } from "react";
import { arrayOf, string, func } from "prop-types";
import Input from "../../../components/inputs/Input";
import { I18N } from "../../../config";
import uniques from "../../../utils/uniques";
import Clickable from "../../../components/Clickable";
import { useDBApi, fetchTagsQueryName } from "../../../components/DBApi";

const TagsInput = ({ value: tags, onChange }) => {
  const [query, setQuery] = useState("");

  const { data, loading } = useDBApi(fetchTagsQueryName);

  const existingTags = data || [];

  const choosableTags = existingTags.filter(
    existingTag => !tags.includes(existingTag)
  );

  const handleAddTag = tag => {
    onChange(uniques([...tags, tag]));
    setQuery("");
  };

  const handleRemoveTag = tag => {
    onChange(tags.filter(prevTag => prevTag !== tag));
  };

  return (
    <Fragment>
      <Input
        label={`${I18N.transaction.tags}:`}
        autoComplete="off"
        value={query}
        onKeyUp={ev => {
          if (ev.which === undefined) {
            // One of the datalist options was clicked on
            ev.preventDefault();
            handleAddTag(ev.target.value);
          }
        }}
        onChange={setQuery}
        onKeyPress={ev => {
          if (ev.key === "Enter") {
            ev.preventDefault();
            handleAddTag(ev.target.value);
          }
        }}
        placeholder={loading ? I18N.placeholders.loading_dots : ""}
        disabled={loading}
        datalist={choosableTags}
      />
      {tags.map(tag => (
        <Clickable key={tag} onClick={() => handleRemoveTag(tag)}>
          {tag}
        </Clickable>
      ))}
    </Fragment>
  );
};

TagsInput.propTypes = {
  value: arrayOf(string).isRequired,
  onChange: func.isRequired
};

export default TagsInput;
