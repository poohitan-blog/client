import React, { useState } from 'react';
import PropTypes from 'prop-types';
import LazyLoad from 'react-lazyload';
import cc from 'classcat';

import Disqus from 'components/post/comments/Disqus';
import { Circle } from 'components/ui/Loader';

import styles from 'styles/components/post/comment-form.module.scss';

function CommentForm({ title, slug }) {
  const [loading, setLoading] = useState(true);

  function hideLoader() {
    setLoading(false);
  }

  const className = cc({
    [styles.formWrapper]: true,
    [styles.loading]: loading,
  });

  return (
    <div id="comments" className={styles.wrapper}>
      <div className={className}>
        <div className={styles.loader}>
          <span className={styles.encouragement}>Напиши коментар, трясця</span>
          <Circle className={styles.loaderAnimation} />
        </div>
        <LazyLoad offset={300}>
          <Disqus
            title={title}
            identifier={slug}
            onReady={hideLoader}
          />
        </LazyLoad>
      </div>
    </div>
  );
}

CommentForm.propTypes = {
  title: PropTypes.string.isRequired,
  slug: PropTypes.string.isRequired,
};

export default CommentForm;
