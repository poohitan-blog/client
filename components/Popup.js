import React from 'react';
import PropTypes from 'prop-types';
import CloseIcon from '../static/icons/remove.svg';

class Popup extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      visible: props.visible,
    };

    this.close = this.close.bind(this);
  }

  componentWillReceiveProps(props) {
    this.setState({ visible: props.visible });
  }

  close() {
    this.setState({ visible: false });
  }

  render() {
    const visibilityClassName = this.state.visible ? 'popup-wrapper-visible' : '';

    return (
      <div className={`popup-wrapper ${visibilityClassName}`}>
        <div className="popup">
          <button className="popup-close-button" onClick={this.close}><CloseIcon /></button>
          {this.props.children}
        </div>
        <div className="popup-shadow" onClick={this.close} />
      </div>
    );
  }
}

Popup.propTypes = {
  children: PropTypes.node.isRequired,
  visible: PropTypes.bool,
};

Popup.defaultProps = {
  visible: false,
};

export default Popup;
