import PropTypes from "prop-types";

// eslint-disable-next-line import/prefer-default-export
export const transactionPropType = PropTypes.shape({
  amount: PropTypes.number.isRequired,
  date: PropTypes.number.isRequired,
  account: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired
});