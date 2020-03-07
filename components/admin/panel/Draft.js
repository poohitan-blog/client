import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';

import styles from '../../../styles/components/admin/panel.scss';

const Draft = ({ title, slug }) => (
  <Link href="/p/[slug]" as={`/p/${slug}`}>
    <a className={styles.listItem}>
      <div className={styles.listSentence}>{title}</div>
    </a>
  </Link>
);

Draft.propTypes = {
  slug: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
};

export default Draft;
