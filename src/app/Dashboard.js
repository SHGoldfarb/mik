import React from "react";
import PropTypes from "prop-types";

const Dashboard = ({ transactions }) => (
  <div>{JSON.stringify(transactions)}</div>
);

Dashboard.propTypes = {
  transactions: PropTypes.arrayOf(
    PropTypes.shape({
      amount: PropTypes.number.isRequired,
      date: PropTypes.number.isRequired,
      account: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired
    })
  ).isRequired
};

export default Dashboard;
