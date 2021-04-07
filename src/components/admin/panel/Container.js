import React from 'react';
import PropTypes from 'prop-types';

import styles from 'styles/components/admin/panel.module.scss';

function Container({ title, children }) {
  return (
    <div className={styles.block}>
      <h3>{title}</h3>
      <ul>
        {
          children || <span className={styles.empty}>Тут порожньо</span>
        }
      </ul>
    </div>
  );
}

Container.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

export default Container;
