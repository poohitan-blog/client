import React from 'react';
import PropTypes from 'prop-types';

import { describeWordCount } from '../../services/grammar';

import styles from '../../styles/components/admin/tag-suggestions.module.scss';

const TagSuggestions = ({ tags, count, onClick }) => {
  const markup = Object.keys(tags)
    .sort((left, right) => {
      if (tags[left] < tags[right]) {
        return 1;
      }

      if (tags[left] > tags[right]) {
        return -1;
      }

      return 0;
    })
    .slice(0, count)
    .map((tag) => {
      const tagWeight = tags[tag];
      const title = `${describeWordCount(tagWeight, ['запис', 'записи', 'записів'])} із цією позначкою`;

      return <span key={tag} title={title} className={styles.suggestion} onClick={() => onClick(tag)}>{tag}</span>;
    });

  return (
    <div className={styles.wrapper}>
      {markup}
    </div>
  );
};

TagSuggestions.propTypes = {
  tags: PropTypes.shape({}),
  count: PropTypes.number,
  onClick: PropTypes.func,
};

TagSuggestions.defaultProps = {
  tags: {},
  count: Number.MAX_SAFE_INTEGER,
  onClick: () => {},
};

export default TagSuggestions;
