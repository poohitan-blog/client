import React from 'react';
import PropTypes from 'prop-types';
import Router from 'next/router';
import NProgress from 'nprogress';
import { initGA, logPageView } from '../utils/analytics';

import AdminPanel from './admin/Panel';
import LoginButton from './LoginButton';

NProgress.configure({ showSpinner: false });
Router.onRouteChangeStart = () => NProgress.start();
Router.onRouteChangeComplete = () => NProgress.done();
Router.onRouteChangeError = () => NProgress.done();

class Wrapper extends React.Component {
  componentDidMount() {
    if (this.context.isAuthenticated) {
      return;
    }

    if (!global.GA_INITIALIZED) {
      initGA();
      global.GA_INITIALIZED = true;
    }

    logPageView();
  }

  render() {
    return (
      <div className="wrapper">
        {this.props.children}
        {this.context.isAuthenticated && <AdminPanel />}
        {!this.context.isAuthenticated && <LoginButton />}

        <div className="wrapper-shadow" />
      </div>
    );
  }
}

Wrapper.propTypes = {
  children: PropTypes.node.isRequired,
};

Wrapper.contextTypes = {
  isAuthenticated: PropTypes.bool,
};

export default Wrapper;
