import React, { useContext } from "react";
import Button from "./Button";
import { I18N } from "../config";
import { AppContainerContext } from "../app/utils";

const BackButton = props => {
  const { history } = useContext(AppContainerContext);
  return (
    <Button onClick={() => history.goBack()} {...props}>
      {`\u2190 ${I18N.back}`}
    </Button>
  );
};

export default BackButton;
