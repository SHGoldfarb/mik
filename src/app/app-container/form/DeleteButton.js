import React, { Fragment, useState, useContext } from "react";
import { number } from "prop-types";
import Modal from "../../../components/Modal";
import { I18N } from "../../../config";
import Button from "../../../components/Button";
import {
  useDBApi,
  deleteTransactionMutationName
} from "../../../components/DBApi";
import { goToTransactionsView, removeTransactionFromStore } from "./utils";
import { AppContainerContext } from "../../utils";

const DeleteButton = ({ id }) => {
  const [modalActive, setModalActive] = useState(false);
  const { history } = useContext(AppContainerContext);
  const deleteMutation = useDBApi(deleteTransactionMutationName);
  const handleDelete = async () => {
    const { date } = await deleteMutation({
      variables: { id },
      update: (deletedTransaction, store) => {
        removeTransactionFromStore(store, deletedTransaction);
      }
    });
    goToTransactionsView(history, date);
  };
  return (
    <Fragment>
      <Modal onOverlayClick={() => setModalActive(false)} active={modalActive}>
        {I18N.transaction.confirmDelete}
        <Button onClick={handleDelete}>{I18N.yes}</Button>
      </Modal>
      <Button onClick={() => setModalActive(true)}>
        {I18N.transaction.delete}
      </Button>
    </Fragment>
  );
};

DeleteButton.propTypes = {
  id: number.isRequired
};

export default DeleteButton;
