import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';

const Draft = ({ title, path }) => (
  <Link href={`/post?path=${path}`} as={`/p/${path}`}>
    <a className="layout-row layout-align-start-center">
      <div className="admin-panel-list-sentence">{title}</div>
    </a>
  </Link>
);

Draft.propTypes = {
  path: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
};

export default Draft;
