import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';

import { logOut } from '../../services/session';
import Page from './panel/Page';
import Draft from './panel/Draft';

import styles from '../../styles/components/admin/panel.module.scss';

class Panel extends React.Component {
  static logOut(event) {
    event.preventDefault();
    logOut();
  }

  render() {
    const { pages, drafts } = this.props;

    const publicPages = pages.filter((page) => !page.hidden);
    const hiddenPages = pages.filter((page) => page.hidden);
    const allPages = publicPages.concat(...hiddenPages);

    const pagesBlock = !pages.length ? null : (
      <div className={styles.block}>
        <h3>Сторінки</h3>
        <ul>
          {
            allPages.map((page) => (
              <li key={page.slug}>
                <Page slug={page.slug} title={page.title} hidden={page.hidden} />
              </li>
            ))
          }
        </ul>
      </div>
    );

    const draftsBlock = !drafts.length ? null : (
      <div className={styles.block}>
        <h3>Чернетки</h3>
        <ul>
          {
            drafts.map((draft) => (
              <li key={draft.slug}>
                <Draft slug={draft.slug} title={draft.title} />
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
              <Link href="/posts/new"><a>Додати запис</a></Link>
            </li>
            <li>
              <Link href="/trash/new"><a>Додати запис у смітник</a></Link>
            </li>
            <li>
              <Link href="/pages/new"><a>Додати сторінку</a></Link>
            </li>
            <li>
              <Link href="/upload"><a>Завантажити файли</a></Link>
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

Panel.propTypes = {
  pages: PropTypes.arrayOf(PropTypes.shape({})),
  drafts: PropTypes.arrayOf(PropTypes.shape({})),
};

Panel.defaultProps = {
  pages: [],
  drafts: [],
};

export default Panel;
