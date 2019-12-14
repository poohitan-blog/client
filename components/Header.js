import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';

import GoodnessGenerator from './GoodnessGenerator';
import Trashbin from './header/Trashbin';
import HomeIcon from '../public/static/icons/home.svg';
import ArchiveIcon from '../public/static/icons/list.svg';
import SecretAgentIcon from '../public/static/icons/secret-agent.svg';

const Header = ({ trashBinState }) => {
  const items = [
    {
      title: 'Головна',
      href: '/',
      icon: <HomeIcon />,
    },
    {
      title: 'Архів',
      href: '/archive',
      icon: <ArchiveIcon />,
    },
    {
      title: 'Про',
      href: '/path?path=about',
      as: '/about',
      icon: <SecretAgentIcon />,
    },
    {
      title: 'Смітник',
      href: '/trash',
      markup: <Trashbin state={trashBinState} />,
    },
  ];

  return (
    <nav className="header">
      <ul className="menu layout-row layout-align-center-center">
        {
          items.map((item) => (
            <li key={item.title} className="menu-item">
              <Link href={item.href} as={item.as || item.href}>
                <a title={item.title}>
                  {
                    item.markup
                    || (
                      <>
                        <span className="menu-item-content-desktop">{item.title}</span>
                        <span className="menu-item-content-mobile">{item.icon}</span>
                      </>
                    )
                  }
                </a>
              </Link>
            </li>
          ))
        }
      </ul>
      <div className="header-border layout-row layout-align-center-center">
        <hr className="flex-100" />
        <GoodnessGenerator className="header-goodness-generator" />
        <hr className="flex-100" />
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
