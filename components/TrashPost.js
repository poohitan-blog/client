import React from 'react';
import PropTypes from 'prop-types';
import HTMLReactParser from 'html-react-parser';
import { trackWindowScroll } from 'react-lazy-load-image-component';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { format } from 'date-fns';

import AdminControlButtons from './admin/ControlButtons';
import PostCollapser from './trash/PostCollapser';
import { generateLazyPreview, LIGHTBOX_CLASS } from '../services/image-previews';

const Lightbox = dynamic(import('./ui/Lightbox'), { ssr: false, loading: () => null });

const MAX_UNCOLLAPSED_HEIGHT = 1000;

class TrashPost extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      body: HTMLReactParser(props.body, {
        replace(node) {
          if (node.type === 'tag' && node.name === 'img') {
            return generateLazyPreview(node, { scrollPosition: props.scrollPosition });
          }

          return null;
        },
      }),
      collapsed: false,
      collapsable: false,
    };

    this.collapse = this.collapse.bind(this);
    this.unroll = this.unroll.bind(this);
    this.checkIfLongEnoughToCollapse = this.checkIfLongEnoughToCollapse.bind(this);

    this.bodyElement = React.createRef();
  }

  componentDidMount() {
    const { collapsable } = this.props;

    if (collapsable) {
      this.checkIfLongEnoughToCollapse();
    }
  }

  checkIfLongEnoughToCollapse() {
    const currentHeight = this.bodyElement.current.clientHeight;

    if (currentHeight > MAX_UNCOLLAPSED_HEIGHT) {
      this.setState({
        collapsable: true,
        collapsed: true,
      });
    }
  }

  collapse() {
    const fullHeight = this.bodyElement.current.clientHeight;

    this.setState({
      collapsed: true,
    }, () => {
      const { collapsedHeight } = this.state;

      window.scrollTo(0, window.scrollY - (fullHeight - collapsedHeight));
    });
  }

  unroll() {
    const collapsedHeight = this.bodyElement.current.clientHeight;

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

    const formattedDate = format(createdAt, 'dd:MM:yyyy, HH:mm');
    const lightboxImageSelector = `.trash-post-body a.${LIGHTBOX_CLASS}`;

    return (
      <div className={classList.join(' ')}>
        {
          isAuthenticated
          && <AdminControlButtons attachedTo="trashPost" tokens={[id]} className="trash-post-admin-control-buttons" />
        }
        <div className="trash-post-body-wrapper">
          <div className="trash-post-body" ref={this.bodyElement}>{ body }</div>
          <div className="trash-post-body-overlay-gradient" />
        </div>
        <Lightbox selector={lightboxImageSelector} />
        {
          collapsable
          && <PostCollapser isPostCollapsed={collapsed} onClick={() => (collapsed ? this.unroll() : this.collapse())} />
        }
        <div className="trash-post-footer smaller layout-row layout-align-space-between-center">
          <Link as={`/trash/${id}`} href={`/trash?id=${id}`}>
            <a title="Постійне посилання" className="nowrap">постійне посилання</a>
          </Link>
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
  createdAt: PropTypes.instanceOf(Date).isRequired,
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
