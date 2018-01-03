import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import FullBody from './post/FullBody';
import CutBody from './post/CutBody';
import Footer from './post/Footer';
import AdminControlButtons from './admin/ControlButtons';
import * as Text from '../services/text';

const LIGHTBOX_CLASS = 'lightbox-image';

class Post extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      body: Text.wrapImagesInLinks(props.body, { imagesClass: LIGHTBOX_CLASS }),
    };
  }

  componentDidMount() {
    global.$(`.post[data-path="${this.props.path}"] .post-body a.${LIGHTBOX_CLASS}`).featherlightGallery({
      galleryFadeIn: 100,
      galleryFadeOut: 200,
      type: 'image',
    });
  }

  render() {
    const body = this.props.cut
      ? <CutBody {...this.props} body={this.state.body} />
      : <FullBody {...this.props} body={this.state.body} />;

    return (
      <article className="post post-complete" data-path={this.props.path}>
        <h1 className="post-title layout-row layout-align-start-start">
          <Link as={`/p/${this.props.path}`} href={`/post?path=${this.props.path}`} prefetch>
            <a>{this.props.title}</a>
          </Link>
          {
            this.context.isAuthenticated &&
            <div className="post-admin-control-buttons"><AdminControlButtons attachedTo="post" path={this.props.path} /></div>
          }
        </h1>
        <div className="post-body">{body}</div>
        <Footer {...this.props} />
      </article>
    );
  }
}

Post.propTypes = {
  title: PropTypes.string.isRequired,
  body: PropTypes.string.isRequired,
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
