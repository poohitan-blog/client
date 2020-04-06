import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import { withRouter } from 'next/router';

import { Context as AnnouncementContext, POSITIONS } from 'Services/announcements';
import Announcement from 'Components/Announcement';
import SearchBox from 'Components/SearchBox';

import styles from 'Styles/components/footer.module.scss';

const DEFAULT_LINK_TEXTS = {
  next: 'Старіші записи',
  previous: 'Новіші записи',
};

const Footer = ({ pagination, searchBox, router }) => {
  const { currentPage, totalPages } = pagination;
  const { query } = router;
  const hasNextPage = currentPage < totalPages;
  const hasPreviousPage = currentPage > 1;
  const hasPagination = hasNextPage || hasPreviousPage;

  const { next, previous } = (pagination && pagination.linkTexts) || DEFAULT_LINK_TEXTS;

  let previousPagelink;
  let nextPageLink;

  if (hasPreviousPage) {
    previousPagelink = (
      <Link href={{ query: { ...query, page: currentPage - 1 } }}>
        <a className="larger">
          &larr;
          {' '}
          {previous}
        </a>
      </Link>
    );
  }

  if (hasNextPage) {
    nextPageLink = (
      <Link href={{ query: { ...query, page: currentPage + 1 } }}>
        <a className="larger">
          {next}
          {' '}
          &rarr;
        </a>
      </Link>
    );
  }

  const classList = [styles.wrapper];

  if (!hasPagination) {
    classList.push(styles.withoutPagination);
  }

  return (
    <div className={classList.join(' ')} id="footer">
      <div className={styles.pagination}>
        {previousPagelink}
        {nextPageLink}
      </div>
      {
        searchBox ? <div className={styles.searchBox} id="footer-searchbox"><SearchBox /></div> : null
      }
      <AnnouncementContext.Consumer>
        {({ position, text, Icon }) => {
          if (position === POSITIONS.BOTTOM) {
            return <Announcement text={text} Icon={Icon} id="footer-announcement" />;
          }

          return null;
        }}
      </AnnouncementContext.Consumer>
    </div>
  );
};

Footer.propTypes = {
  pagination: PropTypes.shape({
    currentPage: PropTypes.number,
    totalPages: PropTypes.number,

    linkTexts: PropTypes.shape({
      next: PropTypes.string,
      previous: PropTypes.string,
    }),
  }),

  searchBox: PropTypes.bool,

  router: PropTypes.shape({
    query: PropTypes.object,
  }).isRequired,
};

Footer.defaultProps = {
  pagination: {},
  searchBox: true,
};

export default withRouter(React.memo(Footer));
