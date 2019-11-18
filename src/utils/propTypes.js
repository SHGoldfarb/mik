import PropTypes from "prop-types";

// eslint-disable-next-line import/prefer-default-export
export const transactionPropType = PropTypes.shape({
  amount: PropTypes.number.isRequired,
  date: PropTypes.number.isRequired,
  type: PropTypes.string.isRequired,
  comment: PropTypes.string.isRequired
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
