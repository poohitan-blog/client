import React from 'react';
import PropTypes from 'prop-types';
import CloseIcon from '../public/static/icons/remove.svg';

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
    const visibilityClassName = visible ? 'popup-wrapper-visible' : '';

    return (
      <div className={`popup-wrapper ${visibilityClassName}`}>
        <div className="popup">
          <button type="button" className="popup-close-button" onClick={this.close}>
            <CloseIcon />
          </button>
          {children}
        </div>
        <div className="popup-shadow" onClick={this.close} />
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
