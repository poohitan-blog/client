// This component should be rendered client-side, as it uses shuffle()
// which causes unmatched content rendered by server and client.

import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import shuffle from 'shuffle-array';
import { trackWindowScroll } from 'react-lazy-load-image-component';

import TinyPost from './TinyPost';

import styles from '../styles/components/similar-posts-group.module.scss';

const SimilarPostsGroup = ({ posts, displayCount, scrollPosition }) => {
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
                slug={post.slug}
                publishedAt={new Date(post.publishedAt)}
                image={post.image}
                scrollPosition={scrollPosition}
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
  scrollPosition: PropTypes.shape({}),
};

SimilarPostsGroup.defaultProps = {
  posts: [],
  displayCount: 3,
  scrollPosition: null,
};

export default trackWindowScroll(SimilarPostsGroup);
