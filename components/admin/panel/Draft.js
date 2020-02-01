import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';

import styles from '../../../styles/components/admin/panel.scss';

const Draft = ({ title, path }) => (
  <Link href={`/post?path=${path}`} as={`/p/${path}`}>
    <a className={styles.listItemWrapper}>
      <div className={styles.listSentence}>{title}</div>
    </a>
  </Link>
);

Draft.propTypes = {
  path: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
};

export default Draft;
