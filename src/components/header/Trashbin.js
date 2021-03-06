import React from 'react';
import PropTypes from 'prop-types';
import cc from 'classcat';

import TrashbinClosedIcon from 'static/icons/trashbin.svg';
import TrashbinSemiOpenIcon from 'static/icons/trashbin-semi-open.svg';
import TrashbinFullyOpenIcon from 'static/icons/trashbin-fully-open.svg';

import styles from 'styles/components/header/trashbin.module.scss';

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
      return <TrashbinFullyOpenIcon />;
    }

    if (state === 'semi-open') {
      return <TrashbinSemiOpenIcon />;
    }

    return <TrashbinClosedIcon />;
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
      <div className={cc([styles.wrapper, className])} onMouseEnter={this.semiOpen} onMouseLeave={this.close}>
        {this.getTrashbinIcon()}
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
