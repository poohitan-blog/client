import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { stripHTML, shorten } from 'services/text';
import { formatPostDate } from 'services/grammar';

import styles from 'styles/components/compact-post.module.scss';

const CompactPost = (props) => {
  const {
    title,
    body,
    slug,
    publishedAt,
    hidden,
  } = props;
  const shortenedBody = shorten(stripHTML(body), 70);

  return (
    <article className={styles.wrapper}>
      <div className={styles.titleWrapper}>
        <h3 className={styles.title}>
          <Link as={`/p/${slug}`} href="/p/[slug]">
            <a title={title}>{title}</a>
          </Link>
          {
            hidden
            && (
              <div className={styles.titleIcons}>
                <FontAwesomeIcon icon="eye-slash" className={styles.titleIcon} />
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
  slug: PropTypes.string.isRequired,
  publishedAt: PropTypes.instanceOf(Date).isRequired,
  hidden: PropTypes.bool,
};

CompactPost.defaultProps = {
  hidden: false,
};

export default CompactPost;
