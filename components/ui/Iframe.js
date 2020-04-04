import React from 'react';
import PropTypes from 'prop-types';

import { Circle } from './Loader';

import styles from '../../styles/components/ui/iframe.module.scss';

class Iframe extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loaded: false,
    };
  }

  render() {
    const {
      src,
      height,
      allowFullScreen,
      referrerPolicy,
      className,
    } = this.props;

    const iframe = React.createElement('iframe', {
      src,
      allowFullScreen,
      referrerPolicy,
      frameBorder: 0,
      style: {
        width: '100%',
        height: '100%',
      },
      onLoad: () => {
        this.setState({ loaded: true });
      },
    });

    const style = {};

    if (height) {
      style.width = '100%';
      style.height = height.includes('%') ? height : `${parseInt(height, 10)}px`;
    }

    const { loaded } = this.state;

    return (
      <div className={`${styles.wrapper} ${className} ${loaded ? '' : styles.loading}`} style={style}>
        <div className={styles.loader}><Circle className={styles.loaderAnimation} /></div>
        {
          iframe
        }
      </div>
    );
  }
}

Iframe.propTypes = {
  src: PropTypes.string.isRequired,
  height: PropTypes.oneOf([PropTypes.string, PropTypes.number]),
  allowFullScreen: PropTypes.bool,
  referrerPolicy: PropTypes.string,
  className: PropTypes.string,
};

Iframe.defaultProps = {
  height: 0,
  allowFullScreen: false,
  referrerPolicy: '',
  className: null,
};

export default Iframe;
