import React from 'react';
import PropTypes from 'prop-types';
import ReactDisqusComments from 'react-disqus-comments';
import { LazyLoadComponent } from 'react-lazy-load-image-component';

import { current } from '../../config';

import LoaderIcon from '../../public/static/icons/three-dots.svg';
import styles from '../../styles/components/post/comment-form.scss';

const placeholder = (
  <div className={styles.loader}>
    <LoaderIcon />
  </div>
);

const CommentForm = ({ title, slug }) => (
  <div id="comments">
    <LazyLoadComponent threshold={1000} placeholder={placeholder}>
      <ReactDisqusComments
        shortname={current.disqus.shortname}
        identifier={slug}
        title={title}
        url={`${current.clientURL}/p/${slug}`}
        className={styles.wrapper}
      />
    </LazyLoadComponent>
  </div>
);

CommentForm.propTypes = {
  title: PropTypes.string.isRequired,
  slug: PropTypes.string.isRequired,
};

export default CommentForm;
