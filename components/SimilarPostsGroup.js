// This component should be rendered client-side, as it uses shuffle()
// which causes unmatched content rendered by server and client.

import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import shuffle from 'shuffle-array';
import { trackWindowScroll } from 'react-lazy-load-image-component';

import TinyPost from './TinyPost';

const NUMBER_OF_POSTS_TO_DISPLAY = 3;

const SimilarPostsGroup = ({ posts, scrollPosition }) => {
  const postsWithImages = posts.filter(post => post.image);
  const postsToDisplay = postsWithImages.length >= NUMBER_OF_POSTS_TO_DISPLAY
    ? postsWithImages
    : posts;

  return (
    <div className="similar-posts-group">
      <div className="similar-posts-group-header">
        <span>Може шось з цього теж буде цікаво:</span>
        <span>Більше — в <Link href="/archive"><a>Архіві</a></Link></span>
      </div>
      <div className="similar-posts-group-container">
        {
          shuffle(postsToDisplay)
            .slice(0, NUMBER_OF_POSTS_TO_DISPLAY)
            .map(post => <TinyPost key={post.id} {...post} scrollPosition={scrollPosition} />)
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
