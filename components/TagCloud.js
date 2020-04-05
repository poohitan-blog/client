import React from 'react';
import PropTypes from 'prop-types';
import shuffle from 'shuffle-array';

import API from '../services/api';
import Tag from './tagcloud/Tag';
import { Circle } from './ui/Loader';

import styles from '../styles/components/tag-cloud.module.scss';

const MAX_FONT_SIZE = 5;
const MIN_FONT_SIZE = 1;

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

    if (!tags.length) {
      return <Circle className={styles.loader} />;
    }

    const markup = tags.map(({ name, weight, normalizedWeight }) => (
      <Tag key={name} name={name} weight={weight} normalizedWeight={normalizedWeight} />
    ));

    return (
      <div className={styles.wrapper}>
        <div className={styles.cloud} style={{ width }}>
          {markup}
        </div>
      </div>
    );
  }
}

TagCloud.propTypes = {
  maxFontSize: PropTypes.number,
  minFontSize: PropTypes.number,
  width: PropTypes.string,
};

TagCloud.defaultProps = {
  maxFontSize: MAX_FONT_SIZE,
  minFontSize: MIN_FONT_SIZE,
  width: '100%',
};

export default TagCloud;
