import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/client';

import { logPageView, submitFlow } from 'services/analytics';
import { Context as AnnouncementContext, generateAnnouncement } from 'services/announcements';

import LoginButton from 'components/LoginButton';

import PrintAngryDog from 'helpers/angry-dog';

import styles from 'styles/components/wrapper.module.scss';

const Wrapper = ({ children }) => {
  const router = useRouter();

  const [session, loading] = useSession();
  const [announcement, setAnnouncement] = useState('');

  useEffect(() => {
    setAnnouncement(generateAnnouncement());
    PrintAngryDog();
  }, []);

  useEffect(() => {
    function submitPageView(path) {
      if (!path || loading) {
        return;
      }

      const isAuthenticated = Boolean(session);

      logPageView(path, isAuthenticated);
    }

    submitPageView(router.asPath);

    router.events.on('routeChangeStart', submitPageView);
    global.addEventListener('beforeunload', submitFlow);

    return () => {
      router.events.off('routeChangeStart', submitPageView);
      global.removeEventListener('beforeunload', submitFlow);
    };
  }, [loading]);

  return (
    <AnnouncementContext.Provider value={announcement}>
      <div id="wrapper" className={styles.wrapper}>
        {
          children
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
};

export default Wrapper;
