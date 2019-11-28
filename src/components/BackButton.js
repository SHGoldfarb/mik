import React from "react";
import Button from "./Button";
import { I18N } from "../config";
import { historyPropType } from "../utils/propTypes";

const BackButton = ({ history, ...rest }) => (
  <Button onClick={() => history.goBack()} {...rest}>
    {`\u2190 ${I18N.back}`}
  </Button>
);

BackButton.propTypes = {
  history: historyPropType.isRequired
};

export default BackButton;
