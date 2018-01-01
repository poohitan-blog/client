import React from 'react';
import PropTypes from 'prop-types';
import Router from 'next/router';
import NProgress from 'nprogress';

import AdminPanel from './admin/Panel';
import LoginButton from './LoginButton';

NProgress.configure({ showSpinner: false });
Router.onRouteChangeStart = () => NProgress.start();
Router.onRouteChangeComplete = () => NProgress.done();
Router.onRouteChangeError = () => NProgress.done();

const Wrapper = ({ children }, { isAuthenticated }) => (
  <div className="wrapper">
    {children}
    {isAuthenticated && <AdminPanel />}
    {!isAuthenticated && <LoginButton />}

    <div className="wrapper-shadow" />
  </div>
);

Wrapper.propTypes = {
  children: PropTypes.node.isRequired,
};

Wrapper.contextTypes = {
  isAuthenticated: PropTypes.bool,
};

export default Wrapper;
