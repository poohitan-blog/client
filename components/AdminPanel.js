import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import Session from '../services/session';

class AdminPanel extends React.Component {
  static logOut(event) {
    event.preventDefault();
    Session.logOut();
  }

  render() {
    const pages = this.props.pages.map(page => (
      <li key={page.id}>
        <Link href={`/page?path=${page.path}`} as={`/${page.path}`}>
          <a>{page.title}</a>
        </Link>
      </li>
    ));
    const pagesBlock = pages.length ? (
      <div className="admin-panel-block">
        <h3>Сторінки</h3>
        <ul>
          {pages}
        </ul>
      </div>
    ) : null;

    return (
      <nav className="admin-panel">
        <div className="admin-panel-block">
          <h3>Панель приладів</h3>
          <ul>
            <li><a>Додати запис</a></li>
            <li><a>Додати запис у смітник</a></li>
            <li><a>Додати сторінку</a></li>
            <li><a href="#" role="button" onClick={AdminPanel.logOut}>Вийти</a></li>
          </ul>
        </div>
        {pagesBlock}
      </nav>
    );
  }
}

AdminPanel.propTypes = {
  pages: PropTypes.arrayOf(PropTypes.object),
};

AdminPanel.defaultProps = {
  pages: [],
};

export default AdminPanel;
