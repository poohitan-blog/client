import React from 'react';
import PropTypes from 'prop-types';
import Router from 'next/router';
import NProgress from 'nprogress';

NProgress.configure({ showSpinner: false });
Router.onRouteChangeStart = () => NProgress.start();
Router.onRouteChangeComplete = () => NProgress.done();
Router.onRouteChangeError = () => NProgress.done();

const Wrapper = props => (
  <div className="wrapper">
    {props.children}

    <div className="wrapper-shadow" />
  </div>
);

Wrapper.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Wrapper;
