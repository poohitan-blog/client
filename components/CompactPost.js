import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import * as Text from '../services/text';
import { formatPostDate } from '../services/grammar';

const CompactPost = (props) => {
  const bodyWithoutHTML = Text.stripHTML(props.body);
  const shortenedBody = Text.shorten(bodyWithoutHTML, 70);

  return (
    <article className="post post-compact">
      <div className="layout-row layout-align-space-between-start">
        <h3 className="post-title">
          <Link as={`/p/${props.path}`} href={`/post?path=${props.path}`} prefetch><a>{props.title}</a></Link>
        </h3>
        <div className="post-date smaller nowrap">{ formatPostDate(props.publishedAt) }</div>
      </div>
      <div className="post-body">{shortenedBody}</div>
    </article>
  );
};

CompactPost.propTypes = {
  title: PropTypes.string.isRequired,
  body: PropTypes.string.isRequired,
  path: PropTypes.string.isRequired,
  publishedAt: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.instanceOf(Date),
  ]).isRequired,
};

export default CompactPost;
