import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import Session from '../../services/session';
import Page from './panel/Page';
import Draft from './panel/Draft';

import styles from '../../styles/components/admin/panel.scss';

class Panel extends React.Component {
  static logOut(event) {
    event.preventDefault();
    Session.logOut();
  }

  render() {
    const { pages = [] } = this.context;
    const publicPages = pages.filter((page) => !page.private);
    const privatePages = pages.filter((page) => page.private);
    const allPages = publicPages.concat(...privatePages);

    const pagesBlock = !pages.length ? null : (
      <div className={styles.block}>
        <h3>Сторінки</h3>
        <ul>
          {
            allPages.map((page) => (
              <li key={page.id}>
                <Page path={page.path} title={page.title} private={page.private} />
              </li>
            ))
          }
        </ul>
      </div>
    );

    const { drafts = [] } = this.context;
    const draftsBlock = !drafts.length ? null : (
      <div className={styles.block}>
        <h3>Чернетки</h3>
        <ul>
          {
            drafts.map((draft) => (
              <li key={draft.id}>
                <Draft path={draft.path} title={draft.title} />
              </li>
            ))
          }
        </ul>
      </div>
    );

    return (
      <nav className={styles.wrapper} id="admin-panel">
        <div className={styles.block}>
          <h3>Панель приладів</h3>
          <ul>
            <li>
              <Link href="/admin/edit-post" as="/posts/new"><a>Додати запис</a></Link>
            </li>
            <li>
              <Link href="/admin/edit-trash-post" as="/trash/new"><a>Додати запис у смітник</a></Link>
            </li>
            <li>
              <Link href="/admin/edit-page" as="/pages/new"><a>Додати сторінку</a></Link>
            </li>
            <li>
              <Link href="/admin/upload-files" as="/upload"><a>Завантажити файли</a></Link>
            </li>
            <li>
              <a href="#" role="button" onClick={Panel.logOut}>Вийти</a>
            </li>
          </ul>
        </div>
        {pagesBlock}
        {draftsBlock}
      </nav>
    );
  }
}

Panel.contextTypes = {
  pages: PropTypes.arrayOf(PropTypes.object),
  drafts: PropTypes.arrayOf(PropTypes.object),
};

export default Panel;
