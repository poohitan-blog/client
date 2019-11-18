import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import { formatPostDate } from '../services/grammar';

const MAX_TITLE_LENGTH = 50;
const IMAGE_WIDTH = 600;

const TinyPost = ({
  title, path, image, publishedAt,
}) => {
  const cutTitle = title.length > MAX_TITLE_LENGTH
    ? `${title.slice(0, MAX_TITLE_LENGTH)}…`
    : title;

  return (
    <Link as={`/p/${path}`} href={`/post?path=${path}`}>
      <a className="tiny-post" title={title} style={{ backgroundImage: `url("${image}?width=${IMAGE_WIDTH}")` }}>
        <div className="tiny-post-content">
          <div><span className="tiny-post-title">{cutTitle}</span></div>
          <div><span className="tiny-post-date smaller nowrap">{formatPostDate(publishedAt)}</span></div>
        </div>
        <div className="tiny-post-shadow" />
      </a>
    </Link>
  );
};

TinyPost.propTypes = {
  title: PropTypes.string.isRequired,
  path: PropTypes.string.isRequired,
  publishedAt: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.instanceOf(Date),
  ]).isRequired,
  image: PropTypes.string,
};

TinyPost.defaultProps = {
  image: '',
};

export default TinyPost;
