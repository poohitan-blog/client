import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import HiddenIcon from '../../../public/static/icons/hidden.svg';

import styles from '../../../styles/components/admin/panel.scss';

const Page = (props) => {
  const { title, path, private: hidden } = props;

  return (
    <Link href="/[slug]" as={`/${path}`}>
      <a className={styles.listItem}>
        <div className={styles.listSentence}>{title || path}</div>
        {
          hidden && <div className={styles.listIcon}><HiddenIcon /></div>
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
