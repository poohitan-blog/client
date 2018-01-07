import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import moment from 'moment';
import AdminControlButtons from './admin/ControlButtons';
import * as Text from '../services/text';

const LIGHTBOX_CLASS = 'lightbox-image';
const Lightbox = dynamic(import('./ui/Lightbox'), { ssr: false, loading: () => null });

class TrashPost extends React.Component {
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

    imageLinks.forEach((link) => {
      const originalElement = global.document.querySelector(`img[src="${link}?preview=true"]`);

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
    const markup = { __html: this.state.body };
    const formattedDate = moment(this.props.createdAt).format('DD:MM:YYYY, HH:mm');
    const lightboxImageSelector = `.trash-post-body a.${LIGHTBOX_CLASS}`;

    return (
      <div className="trash-post">
        {
          this.context.isAuthenticated &&
          <div className="trash-post-admin-control-buttons">
            <AdminControlButtons attachedTo="trashPost" id={this.props.id} />
          </div>
        }
        <div className="trash-post-body" dangerouslySetInnerHTML={markup} />
        <Lightbox selector={lightboxImageSelector} />
        <div className="trash-post-footer smaller layout-row layout-align-space-between-center">
          <span className="nowrap">
            <Link as={`/trash/${this.props.id}`} href={`/trash?id=${this.props.id}`}><a>постійне посилання</a></Link>
          </span>
          <hr className="trash-post-footer-line flex-100" />
          <span className="nowrap">{ formattedDate }</span>
        </div>
      </div>
    );
  }
}

TrashPost.propTypes = {
  id: PropTypes.string.isRequired,
  body: PropTypes.string.isRequired,
  createdAt: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.instanceOf(Date),
  ]).isRequired,
};

TrashPost.contextTypes = {
  isAuthenticated: PropTypes.bool,
};

export default TrashPost;
