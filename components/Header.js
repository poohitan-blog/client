import Link from 'next/link';

export default () => (
  <nav className="header">
    <ul className="menu layout-row layout-align-center">
      <li><h1><Link href="/">Головна</Link></h1></li>
      <li><h1><Link href="/archive">Архів</Link></h1></li>
      <li><h1><Link href="/about">Про</Link></h1></li>
    </ul>
  </nav>
)
