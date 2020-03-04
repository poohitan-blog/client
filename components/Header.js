import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';

import GoodnessGenerator from './GoodnessGenerator';
import Trashbin from './header/Trashbin';
import HomeIcon from '../public/static/icons/home.svg';
import ArchiveIcon from '../public/static/icons/list.svg';
import SecretAgentIcon from '../public/static/icons/secret-agent.svg';

import styles from '../styles/components/header.scss';

const Header = ({ trashBinState }) => {
  const items = [
    {
      title: 'Головна',
      description: 'Головна сторінка',
      href: '/',
      icon: <HomeIcon />,
    },
    {
      title: 'Архів',
      description: 'Архів записів',
      href: '/archive',
      icon: <ArchiveIcon />,
    },
    {
      title: 'Про',
      description: 'Хто в біса все це пише',
      href: '/page?path=about',
      as: '/about',
      icon: <SecretAgentIcon />,
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
              <Link href={item.href} as={item.as || item.href}>
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
        <hr />
        <GoodnessGenerator id="header-goodness-generator" />
        <hr />
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

export default Header;
