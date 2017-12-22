import React from 'react';
import PropTypes from 'prop-types';
import ReactDisqusComments from 'react-disqus-comments';
import config from '../../config';

const CommentForm = props => (
  <div className="post-comment-form">
    <ReactDisqusComments
      shortname={config.disqus.shortname}
      identifier={props.path}
      title={props.title}
      url={`${config.host}/${props.path}`}
    />
  </div>
);

CommentForm.propTypes = {
  title: PropTypes.string.isRequired,
  path: PropTypes.string.isRequired,
};

export default CommentForm;
