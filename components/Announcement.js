import React from 'react';
import PropTypes from 'prop-types';

import styles from '../styles/components/announcement.scss';

const Announcement = ({ id, text, Icon }) => (
  <div className={styles.wrapper} id={id}>
    { Icon ? <Icon className={styles.icon} /> : null }
    <span className={styles.text}>{text}</span>
  </div>
);

Announcement.propTypes = {
  id: PropTypes.string,
  text: PropTypes.string.isRequired,
  Icon: PropTypes.func,
};

Announcement.defaultProps = {
  id: null,
  Icon: null,
};

export default React.memo(Announcement);
