import React from 'react';
import PropTypes from 'prop-types';
import parse from 'html-react-parser';
import { trackWindowScroll } from 'react-lazy-load-image-component';
import Link from 'next/link';

import AdminControlButtons from 'Components/admin/ControlButtons';
import PostCollapser from 'Components/trash/PostCollapser';

import HTMLProcessor from 'Utils/html-processor';
import { formatPostDate } from 'Services/grammar';
import { Context as SessionContext } from 'Services/session';

import styles from 'Styles/components/trash-post.module.scss';

const MAX_UNCOLLAPSED_HEIGHT = 1000;

class TrashPost extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      body: parse(props.body, {
        replace(node) {
          return new HTMLProcessor(node)
            .asImage({ scrollPosition: props.scrollPosition })
            .asLink()
            .asIframe()
            .getNode();
        },
      }),
      collapsed: false,
      collapsable: false,
    };

    this.collapse = this.collapse.bind(this);
    this.unroll = this.unroll.bind(this);
    this.switchCollapsionState = this.switchCollapsionState.bind(this);
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

  switchCollapsionState() {
    const { collapsed } = this.state;

    if (collapsed) {
      this.unroll();
    } else {
      this.collapse();
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

    return (
      <div className={classList.join(' ')}>
        <SessionContext.Consumer>
          {({ isAuthenticated }) => isAuthenticated && (
            <AdminControlButtons
              attachedTo="trashPost"
              tokens={[id]}
              className={styles.adminControlButtons}
            />
          )}
        </SessionContext.Consumer>
        <div className={styles.bodyWrapper}>
          <div className={styles.body} ref={this.bodyElement}>{ body }</div>
          <div className={styles.bodyOverlayGradient} />
        </div>
        {
          collapsable
          && (
            <PostCollapser
              isPostCollapsed={collapsed}
              onClick={this.switchCollapsionState}
            />
          )
        }
        <div className={styles.footer}>
          <Link as={`/trash/${id}`} href="/trash/[id]">
            <a title="Постійне посилання" className="nowrap">постійне посилання</a>
          </Link>
          <hr className={styles.footerLine} />
          <span className={styles.date} title={formatPostDate(createdAt, { detailed: true })}>
            { formatPostDate(createdAt, { short: true }) }
          </span>
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

export default trackWindowScroll(TrashPost);