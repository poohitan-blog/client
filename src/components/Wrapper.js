import React from 'react';
import PropTypes from 'prop-types';
import Router from 'next/router';
import NProgress from 'nprogress';

import { logPageView, submitFlow } from 'services/analytics';
import { Context as SessionContext } from 'services/session';
import { Context as AnnouncementContext, getAnnouncement } from 'services/announcements';

import AdminPanel from 'components/admin/Panel';
import LoginButton from 'components/LoginButton';

import PrintAngryDog from 'helpers/angry-dog';

import styles from 'styles/components/wrapper.module.scss';

NProgress.configure({ showSpinner: false });
Router.events.on('routeChangeStart', NProgress.start);
Router.events.on('routeChangeError', NProgress.done);
Router.events.on('routeChangeComplete', NProgress.done);

class Wrapper extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      announcement: {},
    };

    this.logPageView = this.logPageView.bind(this);
  }

  componentDidMount() {
    this.setState({ announcement: getAnnouncement() });

    this.logPageView(Router.asPath);
    Router.events.on('routeChangeComplete', this.logPageView);
    global.addEventListener('beforeunload', submitFlow);

    PrintAngryDog();
  }

  componentWillUnmount() {
    Router.events.off('routeChangeComplete', this.logPageView);
    global.removeEventListener('beforeunload', submitFlow);
  }

  logPageView(path) {
    const { isAuthenticated } = this.context;

    if (!isAuthenticated && path && path !== this.lastTrackedPath) {
      logPageView(path);

      this.lastTrackedPath = path;
    }
  }

  render() {
    const { children } = this.props;
    const { isAuthenticated, pages, drafts } = this.context;
    const { announcement } = this.state;

    return (
      <>
        <AnnouncementContext.Provider value={announcement}>
          <div id="wrapper" className={styles.wrapper}>
            {
              children
            }
            {
              isAuthenticated && <AdminPanel pages={pages} drafts={drafts} />
            }
            {
              !isAuthenticated && <LoginButton />
            }
            <div className={styles.shadow} />
          </div>
        </AnnouncementContext.Provider>
      </>
    );
  }
}

Wrapper.contextType = SessionContext;

Wrapper.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Wrapper;
