import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import HiddenIcon from '../../../public/static/icons/hidden.svg';

const Page = props => (
  <Link href={`/page?path=${props.path}`} as={`/${props.path}`}>
    <a className="layout-row layout-align-start-center">
      <div className="admin-panel-list-sentence">{props.title || props.path}</div>
      {props.private && <div className="admin-panel-list-icon"><HiddenIcon /></div>}
    </a>
  </Link>
);

Page.propTypes = {
  path: PropTypes.string.isRequired,
  title: PropTypes.string,
  private: PropTypes.bool,
};

Page.defaultProps = {
  title: '',
  private: false,
};

export default Page;
