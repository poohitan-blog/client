import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import styles from 'styles/components/admin/panel.module.scss';

const Page = (props) => {
  const { title, slug, hidden } = props;

  return (
    <Link href="/[slug]" as={`/${slug}`}>
      <a className={styles.listItem}>
        <div className={styles.listSentence}>{title || slug}</div>
        {
          hidden && <FontAwesomeIcon icon="eye-slash" className={styles.listIcon} />
        }
      </a>
    </Link>
  );
};

Page.propTypes = {
  slug: PropTypes.string.isRequired,
  title: PropTypes.string,
  hidden: PropTypes.bool,
};

Page.defaultProps = {
  title: '',
  hidden: false,
};

export default Page;
