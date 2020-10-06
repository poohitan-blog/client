import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import cc from 'classcat';

import styles from 'styles/components/trash/post-collapser.module.scss';

const PostCollapser = ({ isPostCollapsed, onClick }) => {
  const text = isPostCollapsed ? 'Розгорнути' : 'Згорнути';
  const iconClass = isPostCollapsed ? styles.iconCollapsed : '';

  return (
    <div className={styles.wrapper} title={text} onClick={onClick}>
      <FontAwesomeIcon icon="angle-double-down" className={cc([styles.icon, iconClass])} />
      <div className={styles.text}>{text}</div>
      <FontAwesomeIcon icon="angle-double-down" className={cc([styles.icon, iconClass])} />
    </div>
  );
};

PostCollapser.propTypes = {
  isPostCollapsed: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default React.memo(PostCollapser);
