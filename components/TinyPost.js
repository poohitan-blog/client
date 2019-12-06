import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import { LazyLoadComponent } from 'react-lazy-load-image-component';

import { formatPostDate } from '../services/grammar';

const MAX_TITLE_LENGTH = 50;
const IMAGE_WIDTH = 300;

const TinyPost = ({
  title,
  path,
  image,
  publishedAt,
  scrollPosition,
}) => {
  const cutTitle = title.length > MAX_TITLE_LENGTH
    ? `${title.slice(0, MAX_TITLE_LENGTH)}…`
    : title;

  return (
    <LazyLoadComponent threshold={300} scrollPosition={scrollPosition}>
      <Link as={`/p/${path}`} href={`/post?path=${path}`}>
        <a className="tiny-post" title={title} style={{ backgroundImage: `url("${image}?width=${IMAGE_WIDTH}")` }}>
          <div className="tiny-post-content">
            <div><span className="tiny-post-title">{cutTitle}</span></div>
            <div><span className="tiny-post-date smaller nowrap">{formatPostDate(publishedAt)}</span></div>
          </div>
          <div className="tiny-post-shadow" />
        </a>
      </Link>
    </LazyLoadComponent>
  );
};

TinyPost.propTypes = {
  title: PropTypes.string.isRequired,
  path: PropTypes.string.isRequired,
  publishedAt: PropTypes.instanceOf(Date).isRequired,
  image: PropTypes.string,
  scrollPosition: PropTypes.shape({}),
};

TinyPost.defaultProps = {
  image: '',
  scrollPosition: null,
};

export default TinyPost;
