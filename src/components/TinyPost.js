import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import LazyLoad from 'react-lazyload';

import { Rectangle } from 'components/ui/Loader';

import styles from 'styles/components/tiny-post.module.scss';

const IMAGE_WIDTH = 300;

const TinyPost = ({
  title,
  description,
  slug,
  image,
}) => (
  <LazyLoad offset={300} placeholder={<Rectangle />}>
    <Link href={`/p/${slug}`}>
      <a className={styles.wrapper} title={description || title} style={{ backgroundImage: `url("${image}?width=${IMAGE_WIDTH}")` }}>
        <div className={styles.content}>
          <div><span className={styles.title}>{title}</span></div>
        </div>
        <div className={styles.shadow} />
      </a>
    </Link>
  </LazyLoad>
);

TinyPost.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  slug: PropTypes.string.isRequired,
  image: PropTypes.string,
};

TinyPost.defaultProps = {
  description: '',
  image: '',
};

export default TinyPost;
