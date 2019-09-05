import React from 'react';
import PropTypes from 'prop-types';
import ReactHtmlParser from 'react-html-parser';
import { trackWindowScroll } from 'react-lazy-load-image-component';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import moment from 'moment';
import AdminControlButtons from './admin/ControlButtons';

import { generateLazyPreview, LIGHTBOX_CLASS } from '../services/image-previews';

const Lightbox = dynamic(import('./ui/Lightbox'), { ssr: false, loading: () => null });

class TrashPost extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      body: ReactHtmlParser(props.body, {
        transform(node) { // eslint-disable-line
          if (node.type === 'tag' && node.name === 'img') {
            return generateLazyPreview(node, props.scrollPosition);
          }
        },
      }),
    };
  }

  render() {
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
        <div className="trash-post-body">{ this.state.body }</div>
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
  scrollPosition: PropTypes.shape({}),
};

TrashPost.defaultProps = {
  scrollPosition: null,
};

TrashPost.contextTypes = {
  isAuthenticated: PropTypes.bool,
};

export default trackWindowScroll(TrashPost);
