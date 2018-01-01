import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import FullBody from './post/FullBody';
import CutBody from './post/CutBody';
import Footer from './post/Footer';
import AdminControlButtons from './admin/ControlButtons';

const Post = (props, context) => {
  const body = props.cut ? <CutBody {...props} /> : <FullBody {...props} />;

  return (
    <article className="post post-complete">
      <h1 className="post-title layout-row layout-align-start-start">
        <Link as={`/p/${props.path}`} href={`/post?path=${props.path}`} prefetch>
          <a>{props.title}</a>
        </Link>
        {
          context.isAuthenticated &&
          <div className="post-admin-control-buttons"><AdminControlButtons attachedTo="post" path={props.path} /></div>
        }
      </h1>
      <div className="post-body">{body}</div>
      <Footer {...props} />
    </article>
  );
};

Post.propTypes = {
  title: PropTypes.string.isRequired,
  path: PropTypes.string.isRequired,
  cut: PropTypes.bool,
};

Post.defaultProps = {
  cut: false,
};

Post.contextTypes = {
  isAuthenticated: PropTypes.bool,
};

export default Post;
