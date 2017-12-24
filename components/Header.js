import React from 'react';
import Link from 'next/link';
import Trashbin from './header/Trashbin';

export default () => (
  <nav className="header">
    <ul className="menu layout-gt-xs-row layout-align-gt-xs-center-start layout-column layout-align-start-center">
      <li>
        <h1 className="menu-item"><Link href="/"><a>Головна</a></Link></h1>
      </li>
      <li>
        <h1 className="menu-item"><Link href="/archive"><a>Архів</a></Link></h1>
      </li>
      <li>
        <h1 className="menu-item"><Link as="/about" href="/page?path=about"><a>Про</a></Link></h1>
      </li>
      <li>
        <div className="menu-item"><Link href="/trash"><a><Trashbin /></a></Link></div>
      </li>
    </ul>
  </nav>
);
