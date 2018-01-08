import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import FullBody from './post/FullBody';
import CutBody from './post/CutBody';
import Footer from './post/Footer';
import AdminControlButtons from './admin/ControlButtons';
import * as Text from '../services/text';
import HiddenIcon from '../static/icons/hidden.svg';

const LIGHTBOX_CLASS = 'lightbox-image';
const Lightbox = dynamic(import('./ui/Lightbox'), { ssr: false, loading: () => null });
const SyntaxHighlighter = dynamic(import('./ui/SyntaxHighlighter'), { ssr: false, loading: () => null });
const MathHighlighter = dynamic(import('./ui/MathHighlighter'), { ssr: false, loading: () => null });

class Post extends React.Component {
  constructor(props) {
    super(props);

    const bodyWithLightboxes = Text.wrapImagesInLinks(props.body, { imagesClass: LIGHTBOX_CLASS });
    const bodyWithPreviewsAndLightboxes = Text.createImagePreviews(bodyWithLightboxes);

    this.state = {
      body: bodyWithPreviewsAndLightboxes,
    };
  }

  componentDidMount() {
    const imageLinks = Text.getImagesFromHTML(this.props.body);

    imageLinks.forEach((link, index) => {
      const originalElement = global.document.querySelector(`img[src="${link}?preview=true"][data-image-id="${index}"]`);

      if (!originalElement) {
        return;
      }

      const downloadingElement = global.document.createElement('img');

      downloadingElement.onload = function () {
        originalElement.src = this.src;
      };
      downloadingElement.src = link;
    });
  }

  render() {
    const body = this.props.cut
      ? <CutBody {...this.props} body={this.state.body} />
      : <FullBody {...this.props} body={this.state.body} />;

    const lightboxImageSelector = `.post[data-path="${this.props.path}"] .post-body a.${LIGHTBOX_CLASS}`;

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
          {
            this.props.private && <div className="post-title-icon"><HiddenIcon /></div>
          }
        </h1>
        <div className="post-body">{body}</div>
        <Lightbox selector={lightboxImageSelector} />
        <SyntaxHighlighter />
        <MathHighlighter />
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
  private: PropTypes.bool,
};

Post.defaultProps = {
  cut: false,
  private: false,
};

Post.contextTypes = {
  isAuthenticated: PropTypes.bool,
};

export default Post;
