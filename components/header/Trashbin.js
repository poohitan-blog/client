import React from 'react';
import PropTypes from 'prop-types';
import TrashbinClosedIcon from '../../public/static/icons/trashbin.svg';
import TrashbinSemiOpenIcon from '../../public/static/icons/trashbin-semi-open.svg';
import TrashbinFullyOpenIcon from '../../public/static/icons/trashbin-fully-open.svg';

class Trashbin extends React.Component {
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
      return <TrashbinFullyOpenIcon className="trashbin-icon" />;
    }

    if (state === 'semi-open') {
      return <TrashbinSemiOpenIcon className="trashbin-icon" />;
    }

    return <TrashbinClosedIcon className="trashbin-icon" />;
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
    return (
      <div className="header-trashbin" onMouseEnter={this.semiOpen} onMouseLeave={this.close}>
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
};

Trashbin.defaultProps = {
  state: Trashbin.STATES.CLOSED,
};

export default Trashbin;
