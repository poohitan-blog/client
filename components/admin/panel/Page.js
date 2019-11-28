import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import HiddenIcon from '../../../public/static/icons/hidden.svg';

const Page = (props) => {
  const { title, path, private: hidden } = props;

  return (
    <Link href={`/page?path=${path}`} as={`/${path}`}>
      <a className="layout-row layout-align-start-center">
        <div className="admin-panel-list-sentence">{title || path}</div>
        {
          hidden && <div className="admin-panel-list-icon"><HiddenIcon /></div>
        }
      </a>
    </Link>
  );
};

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
