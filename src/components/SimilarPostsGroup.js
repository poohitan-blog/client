// This component should be rendered client-side, as it uses shuffle()
// which causes unmatched content rendered by server and client.

import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import shuffle from 'shuffle-array';

import TinyPost from 'components/TinyPost';

import styles from 'styles/components/similar-posts-group.module.scss';

const SimilarPostsGroup = ({ posts, displayCount }) => {
  const postsWithImages = posts.filter((post) => post.image);
  const postsToDisplay = postsWithImages.length >= displayCount
    ? postsWithImages
    : posts;

  return (
    <div className={styles.wrapper} id="similar-posts-group">
      <div className={styles.header}>
        <div className={styles.headerItem}>Може шось з цього теж буде цікаво:</div>
        <div className={styles.headerItem}>
          <span>Більше — в</span>
          {' '}
          <Link href="/archive"><a title="Архів записів">Архіві</a></Link>
        </div>
      </div>
      <div className={styles.container}>
        {
          shuffle(postsToDisplay)
            .slice(0, displayCount)
            .map((post) => (
              <TinyPost
                key={post.slug}
                title={post.title}
                description={post.description}
                slug={post.slug}
                image={post.image}
              />
            ))
        }
      </div>
    </div>
  );
};

SimilarPostsGroup.propTypes = {
  posts: PropTypes.arrayOf(PropTypes.object),
  displayCount: PropTypes.number,
};

SimilarPostsGroup.defaultProps = {
  posts: [],
  displayCount: 3,
};

export default SimilarPostsGroup;
