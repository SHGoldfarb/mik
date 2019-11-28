import React from "react";
import Input from "../../../components/inputs/Input";
import { I18N } from "../../../config";

const CommentInput = props => (
  <Input label={`${I18N.transaction.comment}:`} type="text" {...props} />
);

export default CommentInput;
