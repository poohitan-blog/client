import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import { LazyLoadComponent } from 'react-lazy-load-image-component';

import { formatPostDate } from 'Services/grammar';
import { Rectangle } from 'Components/ui/Loader';

import styles from 'Styles/components/tiny-post.module.scss';

const MAX_TITLE_LENGTH = 50;
const IMAGE_WIDTH = 300;

const TinyPost = ({
  title,
  slug,
  image,
  publishedAt,
  scrollPosition,
}) => {
  const cutTitle = title.length > MAX_TITLE_LENGTH
    ? `${title.slice(0, MAX_TITLE_LENGTH)}…`
    : title;

  return (
    <LazyLoadComponent threshold={300} scrollPosition={scrollPosition} placeholder={<Rectangle />}>
      <Link as={`/p/${slug}`} href="/p/[slug]">
        <a className={styles.wrapper} title={title} style={{ backgroundImage: `url("${image}?width=${IMAGE_WIDTH}")` }}>
          <div className={styles.content}>
            <div><span className={styles.title}>{cutTitle}</span></div>
            <div><span className={styles.date}>{formatPostDate(publishedAt)}</span></div>
          </div>
          <div className={styles.shadow} />
        </a>
      </Link>
    </LazyLoadComponent>
  );
};

TinyPost.propTypes = {
  title: PropTypes.string.isRequired,
  slug: PropTypes.string.isRequired,
  publishedAt: PropTypes.instanceOf(Date).isRequired,
  image: PropTypes.string,
  scrollPosition: PropTypes.shape({}),
};

TinyPost.defaultProps = {
  image: '',
  scrollPosition: null,
};

export default TinyPost;
