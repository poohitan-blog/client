import React from 'react';
import PropTypes from 'prop-types';
import Router from 'next/router';
import NProgress from 'nprogress';
import lazyLoadBlurEffect from 'react-lazy-load-image-component/src/effects/blur.css';

import { logPageView, submitFlow } from '../services/analytics';
import { getPosition } from '../services/goodness-generator';
import { Context as SessionContext } from '../services/session';

import AdminPanel from './admin/Panel';
import LoginButton from './LoginButton';

import styles from '../styles/components/wrapper.scss';

NProgress.configure({ showSpinner: false });
Router.events.on('routeChangeStart', NProgress.start);
Router.events.on('routeChangeError', NProgress.done);
Router.events.on('routeChangeComplete', NProgress.done);

class Wrapper extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};

    this.getGoodnessGeneratorClassName = this.getGoodnessGeneratorClassName.bind(this);
    this.logPageView = this.logPageView.bind(this);
  }

  componentDidMount() {
    this.setState({
      goodnessGeneratorPosition: getPosition(),
    });

    this.logPageView(Router.asPath);

    Router.events.on('routeChangeComplete', this.logPageView);

    global.addEventListener('beforeunload', submitFlow);
  }

  componentWillUnmount() {
    Router.events.off('routeChangeComplete', this.logPageView);
    global.removeEventListener('beforeunload', submitFlow);
  }

  getGoodnessGeneratorClassName() {
    const { goodnessGeneratorPosition } = this.state;

    return goodnessGeneratorPosition
      ? `goodness-generator-on-${goodnessGeneratorPosition}`
      : '';
  }

  logPageView(path) {
    const { isAuthenticated } = this.context;

    if (!isAuthenticated && path && path !== this.lastTrackedPath) {
      logPageView(path);

      this.lastTrackedPath = path;
    }
  }

  render() {
    const { pathname, children, className } = this.props;
    const { isAuthenticated, pages, drafts } = this.context;
    const goodnessGeneratorClassName = this.getGoodnessGeneratorClassName();

    const pathTokens = pathname
      .slice(1)
      .split('/')
      .filter((token) => token)
      .map((token) => `${token}-wrapper`);

    const classList = [styles.wrapper, ...pathTokens, className, goodnessGeneratorClassName];

    return (
      <>
        <style>{lazyLoadBlurEffect}</style>
        <div id="wrapper" className={classList.join(' ')}>
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
      </>
    );
  }
}

Wrapper.contextType = SessionContext;

Wrapper.propTypes = {
  children: PropTypes.node.isRequired,
  pathname: PropTypes.string,
  className: PropTypes.string,
};

Wrapper.defaultProps = {
  pathname: '',
  className: null,
};

export default Wrapper;
