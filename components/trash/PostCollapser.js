import React from 'react';
import PropTypes from 'prop-types';

import AngleIcon from '../../public/static/icons/angle-down.svg';
import styles from '../../styles/components/trash/post-collapser.scss';

const PostCollapser = ({ isPostCollapsed, onClick }) => {
  const text = isPostCollapsed ? 'Розгорнути' : 'Згорнути';
  const iconClass = isPostCollapsed ? styles.iconCollapsed : '';

  return (
    <div className={styles.wrapper} title={text} onClick={onClick}>
      <div className={`${styles.icon} ${iconClass}`}><AngleIcon /></div>
      <div className={styles.text}>{text}</div>
      <div className={`${styles.icon} ${iconClass}`}><AngleIcon /></div>
    </div>
  );
};

PostCollapser.propTypes = {
  isPostCollapsed: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default React.memo(PostCollapser);
