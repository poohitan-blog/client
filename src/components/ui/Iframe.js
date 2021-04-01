import React from 'react';
import PropTypes from 'prop-types';
import cc from 'classcat';

import { Circle } from 'components/ui/Loader';

import styles from 'styles/components/ui/iframe.module.scss';

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

    const classNameString = cc([styles.wrapper, className, {
      [styles.loading]: !loaded,
    }]);

    return (
      <div className={classNameString} style={style}>
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
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
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
