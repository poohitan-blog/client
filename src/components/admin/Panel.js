import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/client';
import { parseCookies } from 'nookies';

import Container from 'components/admin/panel/Container';
import Page from 'components/admin/panel/Page';
import Draft from 'components/admin/panel/Draft';
import { Dots } from 'components/ui/Loader';

import API from 'services/api';

import styles from 'styles/components/admin/panel.module.scss';

const menu = [
  {
    title: 'Додати запис',
    href: '/posts/new',
  },
  {
    title: 'Додати запис у смітник',
    href: '/trash/new',
  },
  {
    title: 'Додати сторінку',
    href: '/pages/new',
  },
  {
    title: 'Завантажити файли',
    href: '/upload',
  },
  {
    title: 'Чернетки',
    href: '/drafts',
  },
];

export function Panel() {
  const [session] = useSession();

  const [pagesList, setPagesList] = useState([]);
  const [draftsList, setDraftsList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);

      const { docs: drafts } = await API.posts.find({ hidden: true }, parseCookies({}));
      const { docs: pages } = await API.pages.find({}, parseCookies({}));
      const publicPages = pages.filter((page) => !page.hidden);
      const hiddenPages = pages.filter((page) => page.hidden);
      const allPages = publicPages.concat(...hiddenPages);

      setPagesList(allPages);
      setDraftsList(drafts);

      setIsLoading(false);
    }

    if (session) {
      fetchData();
    }
  }, [session]);

  if (!session) {
    return null;
  }

  function logOut(event) {
    event.preventDefault();
    signOut();
  }

  const loader = <Dots className={styles.loader} />;

  return (
    <nav className={styles.wrapper} id="admin-panel">
      <Container title="Панель приладів">
        {
          menu.map((item) => (
            <li key={item.href}>
              <Link href={item.href}><a>{item.title}</a></Link>
            </li>
          ))
        }
        <li>
          <a href="#" role="button" onClick={logOut}>Вийти</a>
        </li>
      </Container>
      <Container title="Сторінки">
        {
          isLoading
            ? loader
            : pagesList.map((page) => (
              <li key={page.slug}>
                <Page slug={page.slug} title={page.title} hidden={page.hidden} />
              </li>
            ))
        }
      </Container>
      <Container title="Чернетки">
        {
          isLoading
            ? loader
            : draftsList.map((draft) => (
              <li key={draft.slug}>
                <Draft slug={draft.slug} title={draft.title} />
              </li>
            ))
        }
      </Container>
    </nav>
  );
}

export default Panel;
