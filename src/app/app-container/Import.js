import React, { useState } from "react";
import XLSX from "xlsx";
import Button from "../../components/Button";
import { INCOME, EXPENSE, CASH } from "../../utils/constants";
import { useDBApi, setTransactionsMutationName } from "../../components/DBApi";
import BackButton from "../../components/BackButton";
import { pushHome } from "../../utils/navigation";
import { useHistory } from "../utils";

const RAW_EXPENSE = "Expense";
const RAW_INCOME = "Income";

const parseExcel = excelFile =>
  new Promise(resolve => {
    const reader = new FileReader();

    reader.onload = event => {
      const sheets = {};
      const data = event.target.result;
      const workbook = XLSX.read(data, {
        type: "binary",
        cellDates: true
      });
      workbook.SheetNames.forEach(sheetName => {
        const xlRowObject = XLSX.utils.sheet_to_row_object_array(
          workbook.Sheets[sheetName]
        );
        sheets[sheetName] = xlRowObject;
      });
      resolve(sheets);
    };

    reader.onerror = ev => {
      // eslint-disable-next-line no-console
      console.error(`File could not be read! Code ${ev.target.error.code}`);
    };

    reader.readAsBinaryString(excelFile);
  });

const parseUploadedFile = async uploadedFile => {
  const { Sheet1 } = await parseExcel(uploadedFile);

  return Sheet1.map(
    ({
      Date: date,
      Account: account,
      Category: category,
      Subcategory: subcategory,
      Contents: comment,
      CLP: amount,
      "Income/Expense": rawType
    }) => {
      const type =
        (rawType === RAW_INCOME && INCOME) ||
        (rawType === RAW_EXPENSE && EXPENSE) ||
        null;

      return {
        amount: type ? amount : 0,
        type: type || EXPENSE,
        comment: comment || "",
        date: date.getTime(),
        tags: [account, category, subcategory].filter(tag => !!tag),
        account: CASH
      };
    }
  );
};

const Import = () => {
  const [uploadedFile, setUploadedFile] = useState(null);
  const setTransactionsMutation = useDBApi(setTransactionsMutationName);
  const history = useHistory();

  const setNewTransactions = async () => {
    const transactions = await parseUploadedFile(uploadedFile);
    await setTransactionsMutation({
      variables: { transactions },
      update: (_, store) => {
        store.setAllCleared();
      }
    });
    pushHome(history);
  };

  return (
    <div>
      <BackButton />
      <input
        type="file"
        name="MyFile"
        onChange={ev => {
          setUploadedFile(ev.target.files[0]);
        }}
      />
      <Button onClick={setNewTransactions}>Submit</Button>
    </div>
  );
};

Import.defaultProps = {};

Import.propTypes = {};

export default Import;
