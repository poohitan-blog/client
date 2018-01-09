import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';

const Draft = props => (
  <Link href={`/post?path=${props.path}`} as={`/p/${props.path}`}>
    <a className="layout-row layout-align-start-center">
      <div className="admin-panel-list-sentence">{props.title}</div>
    </a>
  </Link>
);

Draft.propTypes = {
  path: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
};

export default Draft;
