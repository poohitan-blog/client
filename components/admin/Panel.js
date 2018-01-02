import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import Session from '../../services/session';

class Panel extends React.Component {
  static logOut(event) {
    event.preventDefault();
    Session.logOut();
  }

  render() {
    const pages = !this.context ? [] : this.context.pages.map(page => (
      <li key={page.id}>
        <Link href={`/page?path=${page.path}`} as={`/${page.path}`}>
          <a>{page.title || page.path}</a>
        </Link>
      </li>
    ));
    const pagesBlock = pages.length ? (
      <div className="admin-panel-block admin-panel-block-pages">
        <h3>Сторінки</h3>
        <ul>
          {pages}
        </ul>
      </div>
    ) : null;

    return (
      <nav className="admin-panel">
        <div className="admin-panel-block admin-panel-block-main">
          <h3>Панель приладів</h3>
          <ul>
            <li><Link href="/admin/post-editor" as="/posts/new"><a>Додати запис</a></Link></li>
            <li><Link href="/admin/trash-post-editor" as="/trash/new"><a>Додати запис у смітник</a></Link></li>
            <li><Link href="/admin/page-editor" as="/pages/new"><a>Додати сторінку</a></Link></li>
            <li><a href="#" role="button" onClick={Panel.logOut}>Вийти</a></li>
          </ul>
        </div>
        {pagesBlock}
      </nav>
    );
  }
}

Panel.contextTypes = {
  pages: PropTypes.arrayOf(PropTypes.object),
};

export default Panel;
