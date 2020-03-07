import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import { stripHTML, shorten } from '../services/text';
import { formatPostDate } from '../services/grammar';

import HiddenIcon from '../public/static/icons/hidden.svg';
import styles from '../styles/components/compact-post.scss';

const CompactPost = (props) => {
  const {
    title,
    body,
    path,
    publishedAt,
    private: hidden,
  } = props;
  const shortenedBody = shorten(stripHTML(body), 70);

  return (
    <article className={styles.wrapper}>
      <div className={styles.titleWrapper}>
        <h3 className={styles.title}>
          <Link as={`/p/${path}`} href="/p/[slug]">
            <a title={title}>{title}</a>
          </Link>
          {
            hidden
            && (
              <div className={styles.titleIcons}>
                <div className={styles.titleIcon}><HiddenIcon /></div>
              </div>
            )
          }
        </h3>
        <div className={styles.date} title={formatPostDate(publishedAt, { detailed: true })}>
          {formatPostDate(publishedAt)}
        </div>
      </div>
      <div className={styles.body}>{shortenedBody}</div>
    </article>
  );
};

CompactPost.propTypes = {
  title: PropTypes.string.isRequired,
  body: PropTypes.string.isRequired,
  path: PropTypes.string.isRequired,
  publishedAt: PropTypes.instanceOf(Date).isRequired,
  private: PropTypes.bool,
};

CompactPost.defaultProps = {
  private: false,
};

export default CompactPost;
