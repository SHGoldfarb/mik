import PropTypes from "prop-types";
import { CASH, INCOME } from "./constants";

export const validateTransactionShape = ({
  id,
  amount,
  date,
  account,
  type,
  comment,
  tags
} = {}) => {
  const transaction = {
    amount: amount || 0,
    date: date || new Date().getTime(),
    account: account || CASH,
    type: type || INCOME,
    comment: comment ? `${comment}` : "",
    tags: tags || []
  };
  if (id !== undefined) {
    transaction.id = id;
  }
  return transaction;
};

export const transactionPropType = PropTypes.shape({
  amount: PropTypes.number.isRequired,
  date: PropTypes.number.isRequired,
  account: PropTypes.string,
  type: PropTypes.string.isRequired,
  comment: PropTypes.string.isRequired,
  tags: PropTypes.arrayOf(PropTypes.string).isRequired,
  id: PropTypes.number
});

export const dataPropType = dataValidator =>
  PropTypes.shape({
    loading: PropTypes.bool,
    loaded: PropTypes.bool,
    queried: PropTypes.bool,
    data: dataValidator
  });

export const dbApiDataPropType = dataValidator =>
  PropTypes.shape({
    loading: PropTypes.bool,
    fetched: PropTypes.bool,
    data: dataValidator
  });

export const numberOrString = PropTypes.oneOfType([
  PropTypes.string,
  PropTypes.number
]);

export const historyPropType = PropTypes.shape({
  goBack: PropTypes.func.isRequired,
  location: PropTypes.shape({
    search: PropTypes.string.isRequired
  }).isRequired
});
