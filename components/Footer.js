import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import Searchbox from './Searchbox';

const DEFAULT_LINK_TEXTS = {
  next: 'Новіші записи',
  previous: 'Старіші записи',
};

const Footer = (props) => {
  const { currentPage, totalPages } = props.pagination;
  const hasNextPage = currentPage < totalPages;
  const hasPreviousPage = currentPage > 1;

  const { next, previous } = (props.pagination && props.pagination.linkTexts) || DEFAULT_LINK_TEXTS;

  const previousPagelink = hasPreviousPage
    ? <Link href={`?page=${currentPage - 1}`} prefetch><a className="larger">&larr; {previous}</a></Link>
    : null;
  const nextPageLink = hasNextPage
    ? <Link href={`?page=${currentPage + 1}`} prefetch><a className="larger">{next} &rarr;</a></Link>
    : null;

  return (
    <div className="footer layout-row layout-wrap layout-align-space-between-center">
      <div className="footer-pagination">
        {previousPagelink}
        {nextPageLink}
      </div>
      <div className="flex-35 flex-xs-100"><Searchbox /></div>
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
};

Footer.defaultProps = {
  pagination: {},
};

export default Footer;
