import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import HiddenIcon from '../../../public/static/icons/hidden.svg';

import styles from '../../../styles/components/admin/panel.scss';

const Page = (props) => {
  const { title, slug, hidden } = props;

  return (
    <Link href="/[slug]" as={`/${slug}`}>
      <a className={styles.listItem}>
        <div className={styles.listSentence}>{title || slug}</div>
        {
          hidden && <div className={styles.listIcon}><HiddenIcon /></div>
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
