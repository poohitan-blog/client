import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import { useRouter } from 'next/router';
import cc from 'classcat';

import { Context as AnnouncementContext, POSITIONS } from 'services/announcements';
import Announcement from 'components/Announcement';
import SearchBox from 'components/SearchBox';

import styles from 'styles/components/footer.module.scss';

const DEFAULT_LINK_TEXTS = {
  next: 'Старіші записи',
  previous: 'Новіші записи',
};

const Footer = ({ pagination, searchBox }) => {
  const { currentPage, totalPages } = pagination;
  const router = useRouter();
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

  const classNameString = cc({
    [styles.wrapper]: true,
    [styles.withoutPagination]: !hasPagination,
  });

  return (
    <div className={classNameString} id="footer">
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
    query: PropTypes.objectOf(PropTypes.string),
  }).isRequired,
};

Footer.defaultProps = {
  pagination: {},
  searchBox: true,
};

export default React.memo(Footer);
