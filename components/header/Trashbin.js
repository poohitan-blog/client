import React from 'react';
import PropTypes from 'prop-types';
import TrashbinClosedIcon from '../../public/static/icons/trashbin.svg';
import TrashbinSemiOpenIcon from '../../public/static/icons/trashbin-semi-open.svg';
import TrashbinFullyOpenIcon from '../../public/static/icons/trashbin-fully-open.svg';

import styles from '../../styles/components/header/trashbin.scss';

class Trashbin extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      state: props.state || Trashbin.STATES.CLOSED,
    };

    this.semiOpen = this.semiOpen.bind(this);
    this.close = this.close.bind(this);
  }

  getTrashbinIcon() {
    const { state } = this.state;

    if (state === 'fully-open') {
      return <TrashbinFullyOpenIcon className={styles.icon} />;
    }

    if (state === 'semi-open') {
      return <TrashbinSemiOpenIcon className={styles.icon} />;
    }

    return <TrashbinClosedIcon className={styles.icon} />;
  }

  semiOpen() {
    const { state } = this.state;

    if (state === Trashbin.STATES.FULLY_OPEN) {
      return;
    }

    this.setState({
      state: Trashbin.STATES.SEMI_OPEN,
    });
  }

  close() {
    const { state } = this.state;

    if (state === Trashbin.STATES.FULLY_OPEN) {
      return;
    }

    this.setState({
      state: Trashbin.STATES.CLOSED,
    });
  }

  render() {
    const { className } = this.props;

    return (
      <div className={`${styles.wrapper} ${className}`} onMouseEnter={this.semiOpen} onMouseLeave={this.close}>
        { this.getTrashbinIcon() }
      </div>
    );
  }
}

Trashbin.STATES = {
  CLOSED: 'closed',
  SEMI_OPEN: 'semi-open',
  FULLY_OPEN: 'fully-open',
};

Trashbin.propTypes = {
  state: PropTypes.string,
  className: PropTypes.string,
};

Trashbin.defaultProps = {
  state: Trashbin.STATES.CLOSED,
  className: null,
};

export default Trashbin;
