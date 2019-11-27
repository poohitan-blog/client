import React from 'react';
import PropTypes from 'prop-types';
import ReactHtmlParser from 'react-html-parser';
import { trackWindowScroll } from 'react-lazy-load-image-component';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import moment from 'moment';

import AdminControlButtons from './admin/ControlButtons';
import PostCollapser from './trash/PostCollapser';
import { generateLazyPreview, LIGHTBOX_CLASS } from '../services/image-previews';

const Lightbox = dynamic(import('./ui/Lightbox'), { ssr: false, loading: () => null });

const MAX_UNCOLLAPSED_HEIGHT = 1000;

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
      collapsed: false,
      collapsable: false,
    };

    this.collapse = this.collapse.bind(this);
    this.unroll = this.unroll.bind(this);
    this.checkIfLongEnoughToCollapse = this.checkIfLongEnoughToCollapse.bind(this);

    this.rootElement = React.createRef();
  }

  componentDidMount() {
    const { collapsable } = this.props;

    if (collapsable) {
      this.checkIfLongEnoughToCollapse();
    }
  }

  checkIfLongEnoughToCollapse() {
    const currentHeight = this.rootElement.current.clientHeight;

    if (currentHeight > MAX_UNCOLLAPSED_HEIGHT) {
      this.setState({
        collapsable: true,
        collapsed: true,
      });
    }
  }

  collapse() {
    const fullHeight = this.rootElement.current.clientHeight;

    this.setState({
      collapsed: true,
    }, () => {
      const { collapsedHeight } = this.state;

      window.scrollTo(0, window.scrollY - (fullHeight - collapsedHeight));
    });
  }

  unroll() {
    const collapsedHeight = this.rootElement.current.clientHeight;

    this.setState({
      collapsed: false,
      collapsedHeight,
    });
  }

  render() {
    const { id, createdAt } = this.props;
    const { collapsable, collapsed, body } = this.state;
    const { isAuthenticated } = this.context;

    const classList = ['trash-post'];

    if (collapsable) {
      classList.push('trash-post-collapsable');
    }

    if (collapsed) {
      classList.push('trash-post-collapsed');
    }

    const formattedDate = moment(createdAt).format('DD:MM:YYYY, HH:mm');
    const lightboxImageSelector = `.trash-post-body a.${LIGHTBOX_CLASS}`;

    return (
      <div className={classList.join(' ')} ref={this.rootElement}>
        {
          isAuthenticated
          && (
          <div className="trash-post-admin-control-buttons">
            <AdminControlButtons attachedTo="trashPost" tokens={[id]} />
          </div>
          )
        }
        <div className="trash-post-body-wrapper">
          <div className="trash-post-body">{ body }</div>
          <div className="trash-post-body-overlay-gradient" />
        </div>
        <Lightbox selector={lightboxImageSelector} />
        {
          collapsable
          && <PostCollapser isPostCollapsed={collapsed} onClick={() => (collapsed ? this.unroll() : this.collapse())} />
        }
        <div className="trash-post-footer smaller layout-row layout-align-space-between-center">
          <span className="nowrap">
            <Link as={`/trash/${id}`} href={`/trash?id=${id}`}><a title="Постійне посилання">постійне посилання</a></Link>
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
  collapsable: PropTypes.bool,
};

TrashPost.defaultProps = {
  collapsable: true,
  scrollPosition: null,
};

TrashPost.contextTypes = {
  isAuthenticated: PropTypes.bool,
};

export default trackWindowScroll(TrashPost);
