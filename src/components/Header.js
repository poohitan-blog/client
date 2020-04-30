import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { Context as AnnouncementContext, POSITIONS } from 'Services/announcements';
import { withTranslation } from 'Utils/i18n';
import Announcement from 'Components/Announcement';
import Trashbin from 'Components/header/Trashbin';

import styles from 'Styles/components/header.module.scss';

const Header = ({ trashBinState, t }) => {
  const items = [
    {
      title: t('home.title'),
      description: t('home.description'),
      href: '/',
      icon: <FontAwesomeIcon icon="home" />,
    },
    {
      title: t('archive.title'),
      description: t('archive.description'),
      href: '/archive',
      icon: <FontAwesomeIcon icon="book" className={styles.archive} />,
    },
    {
      title: t('about.title'),
      description: t('about.description'),
      href: '/[slug]',
      as: '/about',
      icon: <FontAwesomeIcon icon="ghost" />,
    },
    {
      title: t('trash.title'),
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
  t: PropTypes.func.isRequired,
};

Header.defaultProps = {
  trashBinState: Trashbin.STATES.CLOSED,
};

export default React.memo(withTranslation('header')(Header));
