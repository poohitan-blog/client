import React from 'react';
import PropTypes from 'prop-types';

import { getPhrase } from '../services/goodness-generator';
import HeartIcon from '../public/static/icons/heart.svg';

const GoodnessGenerator = ({ className }) => (
  <div className={`goodness-generator ${className}`}>
    <HeartIcon />
    <span className="goodness-generator-text">{getPhrase()}</span>
  </div>
);

GoodnessGenerator.propTypes = {
  className: PropTypes.string,
};

GoodnessGenerator.defaultProps = {
  className: '',
};

export default GoodnessGenerator;
