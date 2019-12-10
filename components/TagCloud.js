import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import shuffle from 'shuffle-array';
import { createWordCountDescriptor } from '../services/grammar';
import API from '../services/api';
import random from '../helpers/random';

const MAX_FONT_SIZE = 5;
const MIN_FONT_SIZE = 1;

const describePostsCount = createWordCountDescriptor(['запис', 'записи', 'записів']);

function shift($element, { x, y }) {
  $element.css('transform', `translate(${x}px, ${y}px)`);
}

function shake($element) {
  const isShaking = $element.hasClass('tag-shaking');

  if (isShaking) {
    return;
  }

  $element.addClass('tag-shaking');

  const stepDuration = 150;
  let step = 1;

  const weight = Math.max(Number($element.data('weight')), 1);

  let angle = random({ min: 0, max: 2 * Math.PI });

  const initialAmplitude = Math.cbrt(weight) / Math.log10(step + 1); // +1 to avoid Infinity
  const initialCoords = {
    x: initialAmplitude * Math.cos(angle),
    y: initialAmplitude * Math.sin(angle),
  };

  shift($element, initialCoords);

  const interval = setInterval(() => {
    step += 1;
    angle += Math.PI;

    const amplitude = Math.cbrt(weight) / Math.log10(step);

    if (amplitude <= 0.8) {
      shift($element, { x: 0, y: 0 });
      $element.removeClass('tag-shaking');

      clearInterval(interval);

      return;
    }

    const coords = {
      x: amplitude * Math.cos(angle),
      y: amplitude * Math.sin(angle),
    };

    shift($element, coords);
  }, stepDuration);
}

class TagCloud extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      tags: [],
    };

    this.setTags = this.setTags.bind(this);
    this.normalizeTagWeight = this.normalizeTagWeight.bind(this);
  }

  componentDidMount() {
    this.setTags();
  }

  componentDidUpdate() {
    const { shake: shouldShake } = this.props;
    const $tags = $('.tag-cloud .tag');

    $tags.on('mouseover', (event) => {
      const $tag = $(event.target);

      if (shouldShake) {
        shake($tag);
      }
    });
  }

  async setTags() {
    const tagCloud = await API.tags.getCloud();
    const tagsArray = Object.keys(tagCloud)
      .map((tagName) => ({ name: tagName, weight: tagCloud[tagName] }));
    const tagWeights = tagsArray.map((tag) => tag.weight);
    const maxWeight = Math.max(...tagWeights);
    const minWeight = Math.min(...tagWeights);

    const tagsWithNormalizedWeights = Object.keys(tagCloud).map((name) => {
      const weight = tagCloud[name];
      const normalizedWeight = this.normalizeTagWeight(tagCloud[name], { maxWeight, minWeight });

      return { name, weight, normalizedWeight };
    });

    this.setState({
      tags: shuffle(tagsWithNormalizedWeights),
    });
  }

  normalizeTagWeight(tagWeight, { maxWeight, minWeight }) {
    const { minFontSize, maxFontSize } = this.props;
    const relativeWeight = (tagWeight - minWeight) / (maxWeight - minWeight);

    return ((maxFontSize - minFontSize) * relativeWeight) + minFontSize;
  }

  render() {
    const { tags } = this.state;
    const { width } = this.props;
    const markup = tags.map(({ name, weight, normalizedWeight }) => (
      <Link href={`/tag?tag=${name}`} as={`/tag/${name}`} key={name}>
        <a href={`/tag/${name}`} style={{ fontSize: `${normalizedWeight}em` }} data-weight={normalizedWeight} title={`${describePostsCount(weight)}`} className="tag">
          {name}
        </a>
      </Link>
    ));

    return (
      <div className="tag-cloud-wrapper">
        <div className="tag-cloud" style={{ width }}>
          {markup}
        </div>
      </div>
    );
  }
}

TagCloud.propTypes = {
  maxFontSize: PropTypes.number,
  minFontSize: PropTypes.number,
  shake: PropTypes.bool,
  width: PropTypes.string,
};

TagCloud.defaultProps = {
  maxFontSize: MAX_FONT_SIZE,
  minFontSize: MIN_FONT_SIZE,
  shake: false,
  width: '100%',
};

export default TagCloud;
