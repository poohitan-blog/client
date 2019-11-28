import React from 'react';
import PropTypes from 'prop-types';
import Router from 'next/router';
import NProgress from 'nprogress';
import * as Analytics from '../utils/analytics';

import AdminPanel from './admin/Panel';
import LoginButton from './LoginButton';

NProgress.configure({ showSpinner: false });
Router.onRouteChangeStart = () => NProgress.start();
Router.onRouteChangeComplete = () => NProgress.done();
Router.onRouteChangeError = () => NProgress.done();

class Wrapper extends React.Component {
  componentDidMount() {
    const { isAuthenticated } = this.context;

    if (isAuthenticated) {
      return;
    }

    if (!global.ANALYTICS_INITIALIZED) {
      Analytics.init();

      global.ANALYTICS_INITIALIZED = true;
    }

    Analytics.logPageView();
  }

  render() {
    const { isAuthenticated } = this.context;
    const { pathname, children, className } = this.props;

    const pathTokens = pathname
      .slice(1)
      .split('/')
      .filter((token) => token)
      .map((token) => `${token}-page-wrapper`);
    const classList = ['page-wrapper', className, ...pathTokens];

    return (
      <div className={classList.join(' ')}>
        <div className="wrapper">
          {
            children
          }
          {
            isAuthenticated && <AdminPanel />
          }
          {
            !isAuthenticated && <LoginButton />
          }

          <div className="wrapper-shadow" />
        </div>
      </div>
    );
  }
}

Wrapper.propTypes = {
  children: PropTypes.node.isRequired,
  pathname: PropTypes.string,
  className: PropTypes.string,
};

Wrapper.defaultProps = {
  pathname: '',
  className: '',
};

Wrapper.contextTypes = {
  isAuthenticated: PropTypes.bool,
};

export default Wrapper;
