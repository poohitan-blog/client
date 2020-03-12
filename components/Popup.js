import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import styles from '../styles/components/popup.module.scss';

class Popup extends React.Component {
  constructor(props) {
    super(props);

    this.close = this.close.bind(this);
  }

  close() {
    const { onClose } = this.props;

    onClose();
  }

  render() {
    const { visible, children } = this.props;

    return (
      <div className={`${styles.wrapper} ${visible ? styles.visible : ''}`}>
        <div className={styles.popup}>
          <button type="button" className={styles.closeButton} onClick={this.close}>
            <FontAwesomeIcon icon="times" />
          </button>
          {children}
        </div>
        <div className={styles.shadow} onClick={this.close} />
      </div>
    );
  }
}

Popup.propTypes = {
  children: PropTypes.node.isRequired,
  visible: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
};

Popup.defaultProps = {
  visible: false,
};

export default Popup;
