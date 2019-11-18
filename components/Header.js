import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import Trashbin from './header/Trashbin';
import HomeIcon from '../public/static/icons/home.svg';
import ArchiveIcon from '../public/static/icons/list.svg';
import SecretAgentIcon from '../public/static/icons/secret-agent.svg';

const Header = (props) => {
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
      markup: <Trashbin state={props.trashBinState} />,
    },
  ];

  return (
    <nav className="header">
      <ul className="menu layout-row layout-wrap layout-align-center-center">
        {
          items.map(item => (
            <li>
              <h1 className="menu-item">
                <Link href={item.href} as={item.as || item.href}>
                  <a title={item.title}>
                    {
                      item.markup ||
                      (
                        <div className="menu-item-content">
                          <span className="menu-item-content-desktop">{item.title}</span>
                          <span className="menu-item-content-mobile">{item.icon}</span>
                        </div>
                      )
                    }
                  </a>
                </Link>
              </h1>
            </li>
          ))
        }
      </ul>
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
