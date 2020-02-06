import React from 'react';
import PropTypes from 'prop-types';
import HTMLReactParser from 'html-react-parser';
import { trackWindowScroll } from 'react-lazy-load-image-component';
import Link from 'next/link';
import dynamic from 'next/dynamic';

import AdminControlButtons from './admin/ControlButtons';
import PostCollapser from './trash/PostCollapser';
import { generateLazyPreview, LIGHTBOX_CLASS } from '../services/image-previews';
import { formatPostDate } from '../services/grammar';
import { Context as SessionContext } from '../services/session';

import styles from '../styles/components/trash-post.scss';

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

    const classList = [styles.wrapper];

    if (collapsable) {
      classList.push(styles.collapsable);
    }

    if (collapsed) {
      classList.push(styles.collapsed);
    }

    const lightboxImageSelector = `.${styles.body} a.${LIGHTBOX_CLASS}`;

    return (
      <SessionContext.Consumer>
        {({ isAuthenticated }) => (
          <div className={classList.join(' ')}>
            {
              isAuthenticated
              && <AdminControlButtons attachedTo="trashPost" tokens={[id]} className={styles.adminControlButtons} />
            }
            <div className={styles.bodyWrapper}>
              <div className={styles.body} ref={this.bodyElement}>{ body }</div>
              <div className={styles.bodyOverlayGradient} />
            </div>
            <Lightbox selector={lightboxImageSelector} />
            {
              collapsable
              && (
                <PostCollapser
                  isPostCollapsed={collapsed}
                  onClick={() => (collapsed ? this.unroll() : this.collapse())}
                />
              )
            }
            <div className={styles.footer}>
              <Link as={`/trash/${id}`} href={`/trash?id=${id}`}>
                <a title="Постійне посилання" className="nowrap">постійне посилання</a>
              </Link>
              <hr className={styles.footerLine} />
              <span className={styles.date} title={formatPostDate(createdAt, { detailed: true })}>
                { formatPostDate(createdAt, { short: true }) }
              </span>
            </div>
          </div>
        )}
      </SessionContext.Consumer>
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

export default trackWindowScroll(TrashPost);
