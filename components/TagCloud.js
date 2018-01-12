import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import shuffle from 'shuffle-array';
import * as Grammar from '../services/grammar';
import API from '../services/api';
import random from '../helpers/random';

const MAX_FONT_SIZE = 5;
const MIN_FONT_SIZE = 1;

const describePostsCount = Grammar.createWordCountDescriptor(['запис', 'записи', 'записів']);

function shake($element, weight, duration = 7000) {
  const isShaking = $element.hasClass('tag-shaking');

  if (isShaking) {
    return;
  }

  const stepDuration = 150;
  const steps = Math.round(duration / stepDuration);
  let step = 0;

  const angleDeg = random({ min: 0, max: 359 });
  let angleRad = angleDeg / Math.PI;

  $element.addClass('tag-shaking');

  const interval = setInterval(() => { // eslint-disable-line
    const amplitude = Math.log((steps - step) * weight);

    if (amplitude <= 0) {
      $element.css('transform', 'translate(0, 0)');
      $element.removeClass('tag-shaking');

      return clearInterval(interval);
    }

    const x = amplitude * Math.cos(angleRad);
    const y = amplitude * Math.sin(angleRad);

    $element.css('transform', `translate(${x}px, ${y}px)`);

    angleRad += Math.PI;
    step += 1;
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
    const $tags = $('.tag-cloud .tag');

    $tags.on('mouseover', (event) => {
      const $tag = $(event.target);
      const weight = Number($tag.data('weight'));

      if (this.props.shake) {
        shake($tag, weight);
      }
    });
  }

  async setTags() {
    const tagCloud = await API.tags.getCloud();
    const tagsArray = Object.keys(tagCloud)
      .map(tagName => ({ name: tagName, weight: tagCloud[tagName] }));
    const tagWeights = tagsArray.map(tag => tag.weight);
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
    const relativeWeight = (tagWeight - minWeight) / (maxWeight - minWeight);
    const minFontSize = Number(this.props.minFontSize);
    const maxFontSize = Number(this.props.maxFontSize);

    return ((maxFontSize - minFontSize) * relativeWeight) + minFontSize;
  }

  render() {
    const { tags } = this.state;
    const markup = tags.map(({ name, weight, normalizedWeight }) => (
      <Link href={`/tag?tag=${name}`} as={`/tag/${name}`} key={name}>
        <a href={`/tag/${name}`} style={{ fontSize: `${normalizedWeight}em` }} data-weight={weight} title={`${describePostsCount(weight)}`} className="tag">
          {name}
        </a>
      </Link>
    ));

    return (
      <div className="tag-cloud-wrapper">
        <div className="tag-cloud" style={{ width: this.props.width }}>
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
