import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import Trashbin from './header/Trashbin';
import HomeIcon from '../public/icons/home.svg';
import ArchiveIcon from '../public/icons/list.svg';
import SecretAgentIcon from '../public/icons/secret-agent.svg';

const Header = props => (
  <nav className="header">
    <ul className="menu layout-row layout-wrap layout-align-center-center">
      <li>
        <h1 className="menu-item">
          <Link href="/">
            <a>
              <span className="menu-item-content menu-item-content-desktop">Головна</span>
              <HomeIcon className="menu-item-content menu-item-content-mobile" />
            </a>
          </Link>
        </h1>
      </li>
      <li>
        <h1 className="menu-item">
          <Link href="/archive">
            <a>
              <span className="menu-item-content menu-item-content-desktop">Архів</span>
              <ArchiveIcon className="menu-item-content menu-item-content-mobile" />
            </a>
          </Link>
        </h1>
      </li>
      <li>
        <h1 className="menu-item">
          <Link as="/about" href="/page?path=about">
            <a>
              <span className="menu-item-content menu-item-content-desktop">Про</span>
              <SecretAgentIcon className="menu-item-content menu-item-content-mobile" />
            </a>
          </Link>
        </h1>
      </li>
      <li>
        <div className="menu-item">
          <Link href="/trash"><a><Trashbin state={props.trashBinState} /></a></Link>
        </div>
      </li>
    </ul>
  </nav>
);

Header.propTypes = {
  trashBinState: PropTypes.string,
};

Header.defaultProps = {
  trashBinState: Trashbin.STATES.CLOSED,
};

export default Header;
