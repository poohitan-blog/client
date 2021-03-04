import React from 'react';
import PropTypes from 'prop-types';
import parse from 'html-react-parser';
import { trackWindowScroll } from 'react-lazy-load-image-component';
import Link from 'next/link';
import cc from 'classcat';

import AdminControlButtons from 'components/admin/ControlButtons';
import PostCollapser from 'components/trash/PostCollapser';

import HTMLProcessor from 'utils/html-processor';
import { formatPostDate } from 'services/grammar';
import { Context as SessionContext } from 'services/session';

import styles from 'styles/components/trash-post.module.scss';

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
    const { id, shortId, createdAt } = this.props;
    const { collapsable, collapsed, body } = this.state;

    const classNameString = cc({
      [styles.wrapper]: true,
      [styles.collapsable]: collapsable,
      [styles.collapsed]: collapsed,
    });

    return (
      <div className={classNameString}>
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
          <Link href={`/trash/${shortId}`}>
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
  shortId: PropTypes.string.isRequired,
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
