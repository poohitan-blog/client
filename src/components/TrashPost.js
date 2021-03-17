import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import { useSession } from 'next-auth/client';
import parse from 'html-react-parser';
import { trackWindowScroll } from 'react-lazy-load-image-component';
import cc from 'classcat';

import AdminControlButtons from 'components/admin/ControlButtons';
import PostCollapser from 'components/trash/PostCollapser';

import HTMLProcessor from 'utils/html-processor';
import { formatPostDate } from 'services/grammar';

import styles from 'styles/components/trash-post.module.scss';

const MAX_UNCOLLAPSED_HEIGHT = 1000;

const TrashPost = ({
  id, shortId, body, createdAt, scrollPosition, collapsable,
}) => {
  const [longEnoughToCollapse, setLongEnoughToCollapse] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [collapsedHeight, setCollapsedHeight] = useState();
  const [fullHeight, setFullHeight] = useState();
  const [parsedBody] = useState(parse(body, {
    replace(node) {
      return new HTMLProcessor(node)
        .asImage({ scrollPosition })
        .asLink()
        .asIframe()
        .getNode();
    },
  }));

  const [session] = useSession();
  const bodyElement = useRef(null);

  function switchCollapsionState() {
    if (collapsed) {
      setCollapsedHeight(bodyElement.current.clientHeight);
    }

    setCollapsed(!collapsed);
  }

  useEffect(() => {
    if (collapsable) {
      const currentHeight = bodyElement.current.clientHeight;

      if (currentHeight > MAX_UNCOLLAPSED_HEIGHT) {
        setFullHeight(currentHeight);
        setLongEnoughToCollapse(true);
        setCollapsed(true);
      }
    }
  }, [collapsable]);

  useEffect(() => {
    if (collapsed && fullHeight && collapsedHeight) {
      window.scrollTo(0, window.scrollY - (fullHeight - collapsedHeight));
    }
  }, [collapsedHeight, fullHeight, collapsed]);

  const classNameString = cc({
    [styles.wrapper]: true,
    [styles.collapsable]: longEnoughToCollapse,
    [styles.collapsed]: collapsed,
  });

  return (
    <div className={classNameString}>
      {
        session && (
          <AdminControlButtons
            entityType="trashPost"
            tokens={[id]}
            className={styles.adminControlButtons}
          />
        )
      }
      <div className={styles.bodyWrapper}>
        <div className={styles.body} ref={bodyElement}>{ parsedBody }</div>
        <div className={styles.bodyOverlayGradient} />
      </div>
      {
        collapsable && longEnoughToCollapse && (
          <PostCollapser
            isPostCollapsed={collapsed}
            onClick={switchCollapsionState}
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
};

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
