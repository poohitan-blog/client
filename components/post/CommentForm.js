import React from 'react';
import PropTypes from 'prop-types';
import ReactDisqusComments from 'react-disqus-comments';
import { LazyLoadComponent } from 'react-lazy-load-image-component';

import { current } from '../../config';

import LoaderIcon from '../../public/static/icons/three-dots.svg';

const placeholder = (
  <div className="post-comment-form-loader">
    <LoaderIcon />
  </div>
);

const CommentForm = props => (
  <div className="post-comment-form" id="comments">
    <LazyLoadComponent threshold="200" placeholder={placeholder}>
      <ReactDisqusComments
        shortname={current.disqus.shortname}
        identifier={props.path}
        title={props.title}
        url={`${current.clientURL}/p/${props.path}`}
      />
    </LazyLoadComponent>
  </div>
);

CommentForm.propTypes = {
  title: PropTypes.string.isRequired,
  path: PropTypes.string.isRequired,
};

export default CommentForm;
