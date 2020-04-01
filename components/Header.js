import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { Context as AnnouncementContext, POSITIONS } from '../services/announcements';
import Announcement from './Announcement';
import Trashbin from './header/Trashbin';

import styles from '../styles/components/header.scss';

const Header = ({ trashBinState }) => {
  const items = [
    {
      title: 'Головна',
      description: 'Головна сторінка',
      href: '/',
      icon: <FontAwesomeIcon icon="home" />,
    },
    {
      title: 'Архів',
      description: 'Архів записів',
      href: '/archive',
      icon: <FontAwesomeIcon icon="book" />,
    },
    {
      title: 'Про',
      description: 'Хто в біса все це пише',
      href: '/[slug]',
      as: '/about',
      icon: <FontAwesomeIcon icon="ghost" />,
    },
    {
      title: 'Смітник',
      href: '/trash',
      markup: <Trashbin state={trashBinState} className={styles.trashbin} />,
    },
  ];

  return (
    <nav className={styles.wrapper} id="header">
      <ul className={styles.menu} id="header-menu">
        {
          items.map((item) => (
            <li key={item.title} className={styles.menuItem}>
              <Link href={item.href} as={item.as}>
                <a title={item.description || item.title}>
                  {
                    item.markup
                    || (
                      <>
                        <span className={styles.menuItemContentDesktop}>{item.title}</span>
                        <span className={styles.menuItemContentMobile}>{item.icon}</span>
                      </>
                    )
                  }
                </a>
              </Link>
            </li>
          ))
        }
      </ul>
      <div className={styles.border} id="header-border">
        <AnnouncementContext.Consumer>
          {({ position, text, Icon }) => {
            if (position === POSITIONS.TOP) {
              return (
                <>
                  <hr />
                  <Announcement text={text} Icon={Icon} id="header-announcement" />
                  <hr />
                </>
              );
            }

            return <hr />;
          }}
        </AnnouncementContext.Consumer>
      </div>
    </nav>
  );
};

Header.propTypes = {
  trashBinState: PropTypes.string,
};

Header.defaultProps = {
  trashBinState: Trashbin.STATES.CLOSED,
};

export default React.memo(Header);
