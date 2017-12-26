import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import Trashbin from './header/Trashbin';

const Header = props => (
  <nav className="header">
    <ul className="menu layout-gt-xs-row layout-align-gt-xs-center-start layout-column layout-align-start-center">
      <li>
        <h1 className="menu-item"><Link href="/" prefetch><a>Головна</a></Link></h1>
      </li>
      <li>
        <h1 className="menu-item"><Link href="/archive" prefetch><a>Архів</a></Link></h1>
      </li>
      <li>
        <h1 className="menu-item"><Link as="/about" href="/page?path=about" prefetch><a>Про</a></Link></h1>
      </li>
      <li>
        <div className="menu-item">
          <Link href="/trash" prefetch><a><Trashbin state={props.trashBinState} /></a></Link>
        </div>
      </li>
    </ul>
  </nav>
);

Header.propTypes = {
  trashBinState: PropTypes.string.isRequired,
};

export default Header;
