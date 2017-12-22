import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import FullBody from './post/FullBody';
import CutBody from './post/CutBody';
import Footer from './post/Footer';

const Post = (props) => {
  const body = props.cut ? <CutBody {...props} /> : <FullBody {...props} />;

  return (
    <article className="post post-complete">
      <h1 className="post-title"><Link as={props.path} href={`/post?path=${props.path}`}><a>{props.title}</a></Link></h1>
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

export default Post;
