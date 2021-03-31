import React, { useContext } from 'react';
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

  const { next, previous } = pagination?.linkTexts || DEFAULT_LINK_TEXTS;

  const previousPagelink = hasPreviousPage
    ? (
      <Link href={{ query: { ...query, page: currentPage - 1 } }}>
        <a className="larger">
          &larr;
          {' '}
          {previous}
        </a>
      </Link>
    )
    : null;

  const nextPageLink = hasNextPage
    ? (
      <Link href={{ query: { ...query, page: currentPage + 1 } }}>
        <a className="larger">
          {next}
          {' '}
          &rarr;
        </a>
      </Link>
    )
    : null;

  const classNameString = cc({
    [styles.wrapper]: true,
    [styles.withoutPagination]: !hasPagination,
  });

  const announcement = useContext(AnnouncementContext);

  return (
    <div className={classNameString} id="footer">
      <div className={styles.pagination}>
        {previousPagelink}
        {nextPageLink}
      </div>
      {
        searchBox && <div className={styles.searchBox} id="footer-searchbox"><SearchBox /></div>
      }
      {
        announcement.position === POSITIONS.BOTTOM
          && <Announcement text={announcement.text} Icon={announcement.Icon} id="footer-announcement" />
      }
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
};

Footer.defaultProps = {
  pagination: {},
  searchBox: true,
};

export default React.memo(Footer);
