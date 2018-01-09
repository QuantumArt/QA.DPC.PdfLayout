import React from 'react';
import PropTypes from 'prop-types';
import './style.css';

const ErrorMessage = ({ msg }) => (
  <h1
    className="error has-text-centered has-text-danger is-size-4 has-text-weight-semibold"
  >
    {msg}
  </h1>
);

ErrorMessage.propTypes = {
  msg: PropTypes.string.isRequired,
};

export default ErrorMessage;
