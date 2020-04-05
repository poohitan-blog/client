import React from 'react';
import PropTypes from 'prop-types';

import DotsIcon from 'Static/icons/three-dots.svg';
import CircleIcon from 'Static/icons/circle.svg';

import styles from 'Styles/components/ui/loader.module.scss';

export const Dots = ({ className }) => (
  <DotsIcon className={`${styles.dots} ${className}`} />
);

export const Circle = ({ className }) => (
  <CircleIcon className={`${styles.circle} ${className}`} />
);

export const Rectangle = ({ label, className }) => (
  <div className={`${styles.rectangle} ${className}`}>
    <div className={styles.label}>{label}</div>
    <div className={styles.gradient} />
  </div>
);

export const Runner = ({ className }) => (
  <div className={`${styles.runner} ${className}`} />
);

Dots.propTypes = {
  className: PropTypes.string,
};

Dots.defaultProps = {
  className: null,
};

Circle.propTypes = {
  className: PropTypes.string,
};

Circle.defaultProps = {
  className: null,
};

Rectangle.propTypes = {
  label: PropTypes.string,
  className: PropTypes.string,
};

Rectangle.defaultProps = {
  label: 'Завантажується…',
  className: '',
};

Runner.propTypes = {
  className: PropTypes.string,
};

Runner.defaultProps = {
  className: null,
};
