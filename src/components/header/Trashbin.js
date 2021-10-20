import React, { useState } from 'react';
import PropTypes from 'prop-types';
import cc from 'classcat';

import TrashbinClosedIcon from 'static/icons/trashbin.svg';
import TrashbinSemiOpenIcon from 'static/icons/trashbin-semi-open.svg';
import TrashbinFullyOpenIcon from 'static/icons/trashbin-fully-open.svg';

import styles from 'styles/components/header/trashbin.module.scss';

const Trashbin = ({ state, className }) => {
  const [currentState, setCurrentState] = useState(state);

  const getTrashbinIcon = () => {
    if (currentState === Trashbin.STATES.FULLY_OPEN) {
      return <TrashbinFullyOpenIcon />;
    }

    if (currentState === Trashbin.STATES.SEMI_OPEN) {
      return <TrashbinSemiOpenIcon />;
    }

    return <TrashbinClosedIcon />;
  };

  const semiOpen = () => {
    if (currentState === Trashbin.STATES.FULLY_OPEN) {
      return;
    }

    setCurrentState(Trashbin.STATES.SEMI_OPEN);
  };

  const close = () => {
    if (currentState === Trashbin.STATES.FULLY_OPEN) {
      return;
    }

    setCurrentState(Trashbin.STATES.CLOSED);
  };

  return (
    <div className={cc([styles.wrapper, className])} onMouseEnter={semiOpen} onMouseLeave={close}>
      {getTrashbinIcon()}
    </div>
  );
};

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
