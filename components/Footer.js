import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import SearchBox from './SearchBox';

const DEFAULT_LINK_TEXTS = {
  next: 'Старіші записи',
  previous: 'Новіші записи',
};

const Footer = (props) => {
  const { currentPage, totalPages } = props.pagination;
  const { query } = props;
  const hasNextPage = currentPage < totalPages;
  const hasPreviousPage = currentPage > 1;

  const { next, previous } = (props.pagination && props.pagination.linkTexts) || DEFAULT_LINK_TEXTS;

  let previousPagelink;
  let nextPageLink;

  if (hasPreviousPage) {
    previousPagelink = (
      <Link href={{ query: Object.assign({}, query, { page: currentPage - 1 }) }} prefetch>
        <a className="larger">&larr; {previous}</a>
      </Link>
    );
  }

  if (hasNextPage) {
    nextPageLink = (
      <Link href={{ query: Object.assign({}, query, { page: currentPage + 1 }) }} prefetch>
        <a className="larger">{next} &rarr;</a>
      </Link>
    );
  }

  return (
    <div className="footer layout-row layout-wrap layout-align-space-between-center">
      <div className="footer-pagination">
        {previousPagelink}
        {nextPageLink}
      </div>
      <div className="flex-35 flex-xs-100"><SearchBox /></div>
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

  query: PropTypes.shape({}),
};

Footer.defaultProps = {
  pagination: {},
  query: {},
};

export default Footer;
