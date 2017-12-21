import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import FullBody from './post/FullBody';
import CutBody from './post/CutBody';
import Footer from './post/Footer';

const Post = (props) => {
  const postBody = props.cut ? <CutBody {...props} /> : <FullBody {...props} />;

  return (
    <article className="post">
      <h1 className="post-title"><Link as={props.path} href={`/post?path=${props.path}`}><a>{props.title}</a></Link></h1>
      <div className="post-body">{postBody}</div>
      <Footer {...props} />
    </article>
  );
};

Post.propTypes = {
  cut: PropTypes.string,
  path: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
};

Post.defaultProps = {
  cut: false,
};

export default Post;
