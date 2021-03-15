import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import cc from 'classcat';

import styles from 'styles/components/popup.module.scss';

const Popup = ({ children, visible, onClose }) => {
  const classNameString = cc({
    [styles.wrapper]: true,
    [styles.visible]: visible,
  });

  return (
    <div className={classNameString}>
      <div className={styles.popup}>
        <button type="button" className={styles.closeButton} onClick={onClose}>
          <FontAwesomeIcon icon="times" />
        </button>
        {children}
      </div>
      <div className={styles.shadow} onClick={onClose} />
    </div>
  );
};

Popup.propTypes = {
  children: PropTypes.node.isRequired,
  visible: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
};

Popup.defaultProps = {
  visible: false,
};

export default Popup;
