import React from 'react';
import Link from 'next/link';
import Trashbin from './header/Trashbin';

export default () => (
  <nav className="header">
    <ul className="menu layout-row layout-align-center">
      <li>
        <h1><Link href="/"><a>Головна</a></Link></h1>
      </li>
      <li>
        <h1><Link href="/archive"><a>Архів</a></Link></h1>
      </li>
      <li>
        <h1><Link href="/about"><a>Про</a></Link></h1>
      </li>
      <li>
        <Link href="/trash"><a><Trashbin /></a></Link>
      </li>
    </ul>
  </nav>
);
