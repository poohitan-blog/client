import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/client';

import { logPageView, submitFlow } from 'services/analytics';
import { Context as AnnouncementContext, getAnnouncement } from 'services/announcements';

import AdminPanel from 'components/admin/Panel';
import LoginButton from 'components/LoginButton';

import PrintAngryDog from 'helpers/angry-dog';

import styles from 'styles/components/wrapper.module.scss';

const Wrapper = ({ showSidebar, children }) => {
  const router = useRouter();

  const [session] = useSession();
  const [announcement, setAnnouncement] = useState('');

  useEffect(() => {
    function submitPageView(path) {
      if (!path) {
        return;
      }

      const isAuthenticated = Boolean(session);

      logPageView(path, isAuthenticated);
    }

    PrintAngryDog();
    setAnnouncement(getAnnouncement());
    submitPageView(router.asPath);

    router.events.on('routeChangeStart', submitPageView);
    global.addEventListener('beforeunload', submitFlow);

    return () => {
      router.events.off('routeChangeStart', submitPageView);
      global.removeEventListener('beforeunload', submitFlow);
    };
  }, []);

  return (
    <AnnouncementContext.Provider value={announcement}>
      <div id="wrapper" className={styles.wrapper}>
        {
          children
        }
        {
          session && showSidebar && <AdminPanel pages={[]} drafts={[]} />
        }
        {
          !session && <LoginButton />
        }
        <div className={styles.shadow} />
      </div>
    </AnnouncementContext.Provider>
  );
};

Wrapper.propTypes = {
  children: PropTypes.node.isRequired,
  showSidebar: PropTypes.bool,
};

Wrapper.defaultProps = {
  showSidebar: true,
};

export default Wrapper;
