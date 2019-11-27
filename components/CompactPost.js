import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import { stripHTML, shorten } from '../services/text';
import { formatPostDate } from '../services/grammar';
import HiddenIcon from '../public/static/icons/hidden.svg';

const CompactPost = (props) => {
  const {
    title,
    body,
    path,
    publishedAt,
    private: hidden,
  } = props;
  const bodyWithoutHTML = stripHTML(body);
  const shortenedBody = shorten(bodyWithoutHTML, 70);

  return (
    <article className="post post-compact">
      <div className="layout-gt-xs-row layout-align-space-between-start">
        <h3 className="post-title layout-row layout-align-start-start">
          <Link as={`/p/${path}`} href={`/post?path=${path}`}>
            <a title={title}>{title}</a>
          </Link>
          {
            hidden
            && (
              <div className="post-title-icons">
                <div className="post-title-icon"><HiddenIcon /></div>
              </div>
            )
          }
        </h3>
        <div className="post-date smaller nowrap">{formatPostDate(publishedAt)}</div>
      </div>
      <div className="post-body" dangerouslySetInnerHTML={{ __html: shortenedBody }} />
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
  private: PropTypes.bool,
};

CompactPost.defaultProps = {
  private: false,
};

export default CompactPost;
