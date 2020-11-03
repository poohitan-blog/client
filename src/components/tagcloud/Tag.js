import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import cc from 'classcat';

import { createWordCountDescriptor } from 'services/grammar';
import random from 'helpers/random';

import styles from 'styles/components/tag-cloud.module.scss';

const describePostsCount = createWordCountDescriptor(['запис', 'записи', 'записів']);

class Tag extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isShaking: false,
    };

    this.shake = this.shake.bind(this);
    this.shift = this.shift.bind(this);

    this.elementRef = React.createRef();
  }

  shift(x, y) {
    this.elementRef.current.style.transform = `translate(${x}px, ${y}px)`;
  }

  shake() {
    const { isShaking } = this.state;
    const { normalizedWeight } = this.props;

    if (isShaking) {
      return;
    }

    const stepDuration = 150;
    let step = 1;

    const weight = Math.max(normalizedWeight, 1);

    let angle = random({ min: 0, max: 2 * Math.PI });

    const initialAmplitude = Math.cbrt(weight) / Math.log10(step + 1); // +1 to avoid Infinity
    const x = initialAmplitude * Math.cos(angle);
    const y = initialAmplitude * Math.sin(angle);

    this.shift(x, y);

    this.setState({
      isShaking: true,
    });

    const interval = setInterval(() => {
      step += 1;
      angle += Math.PI;

      const amplitude = Math.cbrt(weight) / Math.log10(step);

      if (amplitude <= 0.8) {
        this.shift(0, 0);
        this.setState({ isShaking: false });

        clearInterval(interval);

        return;
      }

      this.shift(amplitude * Math.cos(angle), amplitude * Math.sin(angle));
    }, stepDuration);
  }

  render() {
    const { name, weight, normalizedWeight } = this.props;
    const { isShaking } = this.state;

    const classNameString = cc({
      [styles.tag]: true,
      [styles.isShaking]: isShaking,
    });

    return (
      <Link href={`/tag/${name}`}>
        <a
          href={`/tag/${name}`}
          title={`${describePostsCount(weight)}`}
          onMouseOver={this.shake}
          onFocus={() => {}}
          style={{ fontSize: `${normalizedWeight}em` }}
          ref={this.elementRef}
          className={classNameString}
        >
          {name}
        </a>
      </Link>
    );
  }
}

Tag.propTypes = {
  name: PropTypes.string.isRequired,
  weight: PropTypes.number.isRequired,
  normalizedWeight: PropTypes.number.isRequired,
};

export default Tag;
