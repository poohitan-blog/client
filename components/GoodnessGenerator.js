import React from 'react';
import PropTypes from 'prop-types';

import { getPhrase } from '../services/goodness-generator';
import HeartIcon from '../public/static/icons/heart.svg';

import styles from '../styles/components/goodness-generator.scss';

const GoodnessGenerator = ({ className, id }) => (
  <div className={[styles.wrapper, className].join(' ')} id={id}>
    <HeartIcon />
    <span className={styles.text}>{getPhrase()}</span>
  </div>
);

GoodnessGenerator.propTypes = {
  className: PropTypes.string,
  id: PropTypes.string,
};

GoodnessGenerator.defaultProps = {
  className: null,
  id: null,
};

export default GoodnessGenerator;
