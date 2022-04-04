import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';

import styles from 'styles/components/announcement.module.scss';

const Announcement = ({
  id, text, link, Icon,
}) => (
  <div className={styles.wrapper} id={id}>
    { Icon ? <Icon className={styles.icon} /> : null }
    {
      link
        ? <Link href={link}><a className={styles.link}>{text}</a></Link>
        : <span className={styles.text}>{text}</span>
    }
  </div>
);

Announcement.propTypes = {
  id: PropTypes.string,
  text: PropTypes.string.isRequired,
  link: PropTypes.string,
  Icon: PropTypes.func,
};

Announcement.defaultProps = {
  id: null,
  link: null,
  Icon: null,
};

export default React.memo(Announcement);
