// This component should be rendered client-side, as it uses shuffle()
// which causes unmatched content rendered by server and client.

import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import shuffle from 'shuffle-array';
import { trackWindowScroll } from 'react-lazy-load-image-component';

import TinyPost from './TinyPost';

import styles from '../styles/components/similar-posts-group.scss';

const NUMBER_OF_POSTS_TO_DISPLAY = 3;

const SimilarPostsGroup = ({ posts, scrollPosition }) => {
  const postsWithImages = posts.filter((post) => post.image);
  const postsToDisplay = postsWithImages.length >= NUMBER_OF_POSTS_TO_DISPLAY
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
            .slice(0, NUMBER_OF_POSTS_TO_DISPLAY)
            .map((post) => (
              <TinyPost
                key={post.id}
                title={post.title}
                path={post.path}
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
  scrollPosition: PropTypes.shape({}),
};

SimilarPostsGroup.defaultProps = {
  posts: [],
  scrollPosition: null,
};

export default trackWindowScroll(SimilarPostsGroup);
