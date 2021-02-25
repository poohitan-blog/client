import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import cc from 'classcat';

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
    simplified,
    className,
  } = props;

  const shortenedBody = shorten(stripHTML(body), 70);

  const fullClassName = cc({
    [styles.wrapper]: true,
    [styles.simplified]: simplified,
    [className]: Boolean(className),
  });

  return (
    <article className={fullClassName}>
      <div className={styles.titleWrapper}>
        <h3 className={styles.title}>
          <Link href={`/p/${slug}`}>
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
  simplified: PropTypes.bool,
  className: PropTypes.string,
};

CompactPost.defaultProps = {
  hidden: false,
  simplified: false,
  className: '',
};

export default CompactPost;
